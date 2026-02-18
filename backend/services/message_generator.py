import asyncio
import os
from typing import Any, Dict

from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv()

DEFAULT_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash")


class MessageGenerationError(Exception):
    """Domain-level error for Gemini message generation failures."""


# Lazy-initialized Gemini model instance (kept generic for wide SDK compatibility)
_gemini_model = None


def _get_gemini_model():
    """
    Lazily initialize and return a reusable Gemini model instance.

    Reads GEMINI_API_KEY from environment (optionally loaded via .env).
    """
    global _gemini_model

    if _gemini_model is not None:
        return _gemini_model

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise MessageGenerationError(
            "GEMINI_API_KEY environment variable is not set. "
            "Ensure it is defined in your environment or .env file."
        )

    try:
        genai.configure(api_key=api_key)
        from google.generativeai import GenerativeModel

        _gemini_model = GenerativeModel(DEFAULT_MODEL_NAME)
        return _gemini_model
    except Exception as exc:  # pragma: no cover - defensive
        raise MessageGenerationError(
            f"Failed to initialize Gemini model '{DEFAULT_MODEL_NAME}': {exc}"
        ) from exc


def _to_serializable_dict(obj: Any) -> Dict[str, Any]:
    """
    Best-effort conversion of arbitrary objects (including Pydantic models)
    into plain dictionaries suitable for prompt construction.
    """
    if obj is None:
        return {}

    # Pydantic v2
    if hasattr(obj, "model_dump"):
        return obj.model_dump()  # type: ignore[no-any-return]

    # Pydantic v1 / dataclasses with .dict()
    if hasattr(obj, "dict"):
        return obj.dict()  # type: ignore[no-any-return]

    if isinstance(obj, dict):
        return obj

    return {"value": str(obj)}


def _build_prompt(
    user_data: Any,
    product_data: Any,
    life_event: Any,
) -> str:
    """
    Construct a structured, instruction-heavy prompt for Gemini.

    The prompt explicitly asks for plain text only (no markdown or bullets).
    """
    user = _to_serializable_dict(user_data)
    product = _to_serializable_dict(product_data)
    event = _to_serializable_dict(life_event)

    return (
        "You are an assistant for a bank generating personalized cross-sell offers.\n"
        "Generate a single concise marketing message for the customer below.\n"
        "STRICT REQUIREMENTS:\n"
        "- Output plain text only.\n"
        "- Do NOT use markdown, bullet points, numbered lists, or headings.\n"
        "- Do NOT include asterisks (*), dashes (-) at the start of lines, or emojis.\n"
        "- Do NOT include any meta commentary about being an AI model.\n"
        "- The message must be suitable for sending directly to a banking customer.\n"
        "\n"
        "Customer profile (JSON-like):\n"
        f"{user}\n"
        "\n"
        "Detected life event (JSON-like):\n"
        f"{event}\n"
        "\n"
        "Recommended product (JSON-like):\n"
        f"{product}\n"
        "\n"
        "Write a tailored offer that:\n"
        "- Mentions the product name and main benefit in natural language.\n"
        "- Briefly connects the offer to the customer's life event or behavior.\n"
        "- Uses a warm, professional tone.\n"
        "- Stays compliant: do not guarantee approval, avoid unrealistic promises.\n"
        "Return ONLY the final customer-facing message text."
    )


def _clean_text(raw: str) -> str:
    """
    Apply minimal post-processing to ensure a clean, plain-text response.
    """
    if not raw:
        return ""

    # Strip leading/trailing whitespace and collapse excessive blank lines.
    lines = [line.strip() for line in raw.splitlines()]
    # Remove common markdown bullets / headings if present.
    cleaned_lines = []
    for line in lines:
        if line.startswith(("* ", "- ", "# ")):
            line = line[2:].strip()
        cleaned_lines.append(line)

    text = " ".join(l for l in cleaned_lines if l)
    return text.strip()


async def generate_message(
    user_data: Any,
    product_data: Any,
    life_event: Any,
) -> str:
    """
    Asynchronously generate a personalized banking offer message using Gemini.

    This function:
    - Builds a structured prompt from user, product, and life-event data.
    - Invokes the Gemini API in a worker thread so the FastAPI event loop
      is not blocked.
    - Returns a clean, plain-text message suitable for direct display.
    """
    model = _get_gemini_model()
    prompt = _build_prompt(user_data=user_data, product_data=product_data, life_event=life_event)

    try:
        # Run the (blocking) SDK call in a separate thread.
        response = await asyncio.to_thread(model.generate_content, prompt)
    except Exception as exc:  # pragma: no cover - defensive
        raise MessageGenerationError(f"Gemini API call failed: {exc}") from exc

    text = getattr(response, "text", None)
    if not text:
        raise MessageGenerationError("Gemini API returned an empty response.")

    return _clean_text(text)

