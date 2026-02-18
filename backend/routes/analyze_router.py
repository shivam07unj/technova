from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from models.schemas import AnalysisRequest, AnalysisResponse
from services.message_generator import generate_message as ai_generate_message
from services.database import supabase
import traceback

from services import (
    LifeEventService,
    CreditEligibilityService,
    ProductSelectionService,
    MessageService,
    ComplianceService,
)
from data.mock_data import MOCK_CUSTOMER, MOCK_TRANSACTIONS

router = APIRouter(prefix="/analyze", tags=["analysis"])

# Map Supabase DB categories → backend TransactionCategory enum values
_DB_CATEGORY_MAP = {
    "travel": "vacation",
    "restaurant": "entertainment",
    "electronics": "retail",
    "business": "other",
    "insurance": "other",
    "subscription": "utilities",
    "education": "education",
    "medical": "medical",
    "home_purchase": "home_purchase",
    "wedding": "wedding",
    "automotive": "automotive",
    "vacation": "vacation",
    "retail": "retail",
    "utilities": "utilities",
    "groceries": "groceries",
    "entertainment": "entertainment",
    "other": "other",
}


# ---------------------------------------------------------------------------
# Dependency injection for services
# ---------------------------------------------------------------------------
def get_life_event_service() -> LifeEventService:
    return LifeEventService()


def get_credit_eligibility_service() -> CreditEligibilityService:
    return CreditEligibilityService()


def get_product_selection_service() -> ProductSelectionService:
    return ProductSelectionService()


def get_message_service() -> MessageService:
    return MessageService()


def get_compliance_service() -> ComplianceService:
    return ComplianceService()


# ---------------------------------------------------------------------------
# Helper: map Supabase `users` row → frontend-expected shape
# ---------------------------------------------------------------------------
def _format_user(row: dict) -> dict:
    """Convert DB snake_case columns to camelCase frontend format."""
    initials = "".join(w[0].upper() for w in (row.get("name") or "U").split()[:2])
    return {
        "name": row.get("name", "Unknown"),
        "avatar": initials,
        "creditScore": row.get("credit_score", 0),
        "maxCreditScore": 900,
        "riskCategory": row.get("risk_category", "Unknown"),
        "activeProducts": ["Savings Account"],  # not in DB yet
        "customerId": str(row.get("id", "")),
        "memberSince": "March 2019",  # not in DB yet
        "age": row.get("age"),
        "income": float(row.get("income", 0)),
        "maritalStatus": row.get("marital_status"),
        "preferredChannel": row.get("preferred_channel"),
    }


# ---------------------------------------------------------------------------
# Helper: map Supabase `transactions` row → frontend-expected shape
# ---------------------------------------------------------------------------
_CATEGORY_ICONS = {
    "vacation": "✈️",
    "retail": "🛒",
    "entertainment": "🍽️",
    "home_purchase": "🏠",
    "wedding": "💍",
    "education": "📚",
    "medical": "🏥",
    "automotive": "🚗",
    "utilities": "💡",
    "groceries": "🛒",
    "other": "📦",
}


def _format_transaction(row: dict, idx: int) -> dict:
    category = row.get("category", "other")
    return {
        "id": idx + 1,
        "description": row.get("merchant", "Transaction"),
        "amount": float(row.get("amount", 0)),
        "category": category,
        "icon": _CATEGORY_ICONS.get(category, "📦"),
        "date": (row.get("timestamp") or row.get("created_at", ""))[:10],
        "type": "debit",
    }


# ---------------------------------------------------------------------------
# POST /analyze  —  AI analysis pipeline + save offer to Supabase
# ---------------------------------------------------------------------------
@router.post("", response_model=AnalysisResponse)
async def analyze_transactions(
    request: AnalysisRequest,
    life_event_service: LifeEventService = Depends(get_life_event_service),
    credit_eligibility_service: CreditEligibilityService = Depends(
        get_credit_eligibility_service
    ),
    product_selection_service: ProductSelectionService = Depends(
        get_product_selection_service
    ),
    message_service: MessageService = Depends(get_message_service),
    compliance_service: ComplianceService = Depends(get_compliance_service),
) -> AnalysisResponse:
    """Run the full AI analysis pipeline and persist the offer."""

    # Step 1: Detect life event
    life_event = life_event_service.detect_life_event(request.transactions)

    # Step 2: Check credit eligibility
    credit_eligibility = credit_eligibility_service.check_eligibility(
        transactions=request.transactions,
        annual_income=request.annual_income,
        current_balance=request.current_balance,
        life_event_type=life_event.event_type,
    )

    # Step 3: Select best product
    recommended_product = product_selection_service.select_best_product(
        life_event_type=life_event.event_type,
        credit_eligibility=credit_eligibility,
    )

    # Step 4: Generate personalized message (Gemini AI)
    try:
        personalized_message = await ai_generate_message(
            user_data={"user_id": request.user_id},
            product_data=recommended_product,
            life_event=life_event,
        )
    except Exception as e:
        tb = traceback.format_exc()
        print(f"GEMINI ERROR:\n{tb}")
        personalized_message = f"[AI Error: {str(e)}]"

    # Step 5: Run compliance validation
    compliance = compliance_service.validate_compliance(
        request=request,
        product=recommended_product,
        credit_eligibility=credit_eligibility,
    )

    # Step 6: Save the offer to Supabase (best-effort, don't break response)
    try:
        # Look up product id from Supabase products table
        product_row = (
            supabase.table("products")
            .select("id")
            .eq("name", recommended_product.name)
            .limit(1)
            .execute()
        )
        product_uuid = product_row.data[0]["id"] if product_row.data else None

        offer_data = {
            "user_id": request.user_id,
            "product_id": product_uuid,
            "life_events": life_event.event_type.value,
            "propensity_score": round(life_event.confidence, 4),
            "generated_message": personalized_message,
            "channel": "web",
            "clicked": False,
            "converted": False,
        }
        supabase.table("offers").insert(offer_data).execute()
    except Exception as e:
        print(f"SUPABASE OFFER SAVE ERROR: {e}")

    # Return structured response
    return AnalysisResponse(
        user_id=request.user_id,
        life_event=life_event,
        credit_eligibility=credit_eligibility,
        recommended_product=recommended_product,
        personalized_message=personalized_message,
        compliance=compliance,
    )


# ---------------------------------------------------------------------------
# GET /analyze/customer  —  fetch from Supabase `users` table
# ---------------------------------------------------------------------------
@router.get("/customer")
async def get_customer():
    """Return user profile data from Supabase (falls back to mock)."""
    try:
        result = supabase.table("users").select("*").limit(1).execute()
        if result.data:
            return _format_user(result.data[0])
    except Exception as e:
        print(f"SUPABASE CUSTOMER ERROR: {e}")
    return MOCK_CUSTOMER


# ---------------------------------------------------------------------------
# GET /analyze/transactions  —  fetch from Supabase `transactions` table
# ---------------------------------------------------------------------------
@router.get("/transactions")
async def get_transactions():
    """Return transactions from Supabase (falls back to mock)."""
    try:
        result = (
            supabase.table("transactions")
            .select("*")
            .order("timestamp", desc=True)
            .limit(10)
            .execute()
        )
        if result.data:
            return [_format_transaction(row, i) for i, row in enumerate(result.data)]
    except Exception as e:
        print(f"SUPABASE TRANSACTIONS ERROR: {e}")
    return MOCK_TRANSACTIONS


# ---------------------------------------------------------------------------
# GET /analyze/users  —  list all users with offer counts
# ---------------------------------------------------------------------------
@router.get("/users")
async def list_users():
    """Return all users from Supabase with offer metrics."""
    try:
        users_result = supabase.table("users").select("*").execute()
        users = users_result.data or []

        # Get offer counts per user
        offers_result = supabase.table("offers").select("user_id, clicked, converted").execute()
        all_offers = offers_result.data or []

        # Build per-user metrics
        user_offers = {}
        for offer in all_offers:
            uid = offer["user_id"]
            if uid not in user_offers:
                user_offers[uid] = {"sent": 0, "converted": 0}
            user_offers[uid]["sent"] += 1
            if offer.get("converted"):
                user_offers[uid]["converted"] += 1

        result = []
        for u in users:
            uid = str(u["id"])
            metrics = user_offers.get(uid, {"sent": 0, "converted": 0})
            rate = f"{round((metrics['converted'] / metrics['sent']) * 100)}%" if metrics["sent"] > 0 else "0%"
            result.append({
                **u,
                "id": uid,
                "offers_sent": metrics["sent"],
                "conversion_rate": rate,
            })
        return result
    except Exception as e:
        print(f"SUPABASE LIST USERS ERROR: {e}")
        return []


# ---------------------------------------------------------------------------
# GET /analyze/users/{user_id}  —  single user detail
# ---------------------------------------------------------------------------
@router.get("/users/{user_id}")
async def get_user_detail(user_id: str):
    """Return a single user from Supabase."""
    try:
        result = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
        if result.data:
            return result.data[0]
    except Exception as e:
        print(f"SUPABASE USER DETAIL ERROR: {e}")
    return None


# ---------------------------------------------------------------------------
# GET /analyze/users/{user_id}/transactions
# ---------------------------------------------------------------------------
@router.get("/users/{user_id}/transactions")
async def get_user_transactions(user_id: str):
    """Return transactions for a specific user."""
    try:
        result = (
            supabase.table("transactions")
            .select("*")
            .eq("user_id", user_id)
            .order("timestamp", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"SUPABASE USER TRANSACTIONS ERROR: {e}")
        return []


# ---------------------------------------------------------------------------
# GET /analyze/users/{user_id}/offers
# ---------------------------------------------------------------------------
@router.get("/users/{user_id}/offers")
async def get_user_offers(user_id: str):
    """Return offers for a specific user, with product name."""
    try:
        result = (
            supabase.table("offers")
            .select("*, products(name)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        offers = result.data or []
        # Flatten the product name from the join
        for offer in offers:
            product = offer.pop("products", None)
            offer["product_name"] = product["name"] if product else "—"
        return offers
    except Exception as e:
        print(f"SUPABASE USER OFFERS ERROR: {e}")
        return []


# ---------------------------------------------------------------------------
# POST /analyze/users/{user_id}  —  Trigger AI analysis for an existing user
# ---------------------------------------------------------------------------
@router.post("/users/{user_id}", response_model=AnalysisResponse)
async def analyze_existing_user(
    user_id: str,
    life_event_service: LifeEventService = Depends(get_life_event_service),
    credit_eligibility_service: CreditEligibilityService = Depends(
        get_credit_eligibility_service
    ),
    product_selection_service: ProductSelectionService = Depends(
        get_product_selection_service
    ),
    message_service: MessageService = Depends(get_message_service),
    compliance_service: ComplianceService = Depends(get_compliance_service),
) -> AnalysisResponse:
    """
    Fetch user transactions from DB, run AI analysis, and save offer.
    """
    # 1. Fetch user profile
    user_res = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="User not found")
    user = user_res.data[0]
    
    # 2. Fetch user transactions
    tx_res = (
        supabase.table("transactions")
        .select("*")
        .eq("user_id", user_id)
        .order("timestamp", desc=True)
        .limit(20)
        .execute()
    )
    raw_txs = tx_res.data or []
    
    # 3. Map to pydantic models with category fix
    transactions = []
    for t in raw_txs:
        cat_str = t.get("category", "other").lower()
        # Map DB category to enum, default to OTHER if not found
        mapped_cat = _DB_CATEGORY_MAP.get(cat_str, "other")
        
        transactions.append({
            "amount": float(t.get("amount", 0)),
            "category": mapped_cat,
            "date": t.get("timestamp") or t.get("created_at"),
            "merchant": t.get("merchant"),
            "description": t.get("description")
        })

    # Construct analysis request
    request = AnalysisRequest(
        user_id=user_id,
        transactions=transactions,
        annual_income=float(user.get("income", 0)),
        current_balance=0  # Not in DB yet
    )

    # Reuse the main analysis pipeline logic
    # Step 1: Detect life event
    life_event = life_event_service.detect_life_event(request.transactions)

    # Step 2: Check credit eligibility
    credit_eligibility = credit_eligibility_service.check_eligibility(
        transactions=request.transactions,
        annual_income=request.annual_income,
        current_balance=request.current_balance,
        life_event_type=life_event.event_type,
    )

    # Step 3: Select best product
    recommended_product = product_selection_service.select_best_product(
        life_event_type=life_event.event_type,
        credit_eligibility=credit_eligibility,
    )

    # Step 4: Generate personalized message (Gemini AI)
    try:
        personalized_message = await ai_generate_message(
            user_data={"user_id": request.user_id, "name": user.get("name")},
            product_data=recommended_product,
            life_event=life_event,
        )
    except Exception as e:
        tb = traceback.format_exc()
        print(f"GEMINI ERROR:\n{tb}")
        personalized_message = f"[AI Error: {str(e)}]"

    # Step 5: Run compliance validation
    compliance = compliance_service.validate_compliance(
        request=request,
        product=recommended_product,
        credit_eligibility=credit_eligibility,
    )

    # Step 6: Save the offer to Supabase
    try:
        # Look up product id
        product_row = (
            supabase.table("products")
            .select("id")
            .eq("name", recommended_product.name)
            .limit(1)
            .execute()
        )
        product_uuid = product_row.data[0]["id"] if product_row.data else None

        offer_data = {
            "user_id": request.user_id,
            "product_id": product_uuid,
            "life_events": life_event.event_type.value,
            "propensity_score": round(life_event.confidence, 4),
            "generated_message": personalized_message,
            "channel": "web",
            "clicked": False,
            "converted": False,
        }
        supabase.table("offers").insert(offer_data).execute()
    except Exception as e:
        print(f"SUPABASE OFFER SAVE ERROR: {e}")

    return AnalysisResponse(
        user_id=request.user_id,
        life_event=life_event,
        credit_eligibility=credit_eligibility,
        recommended_product=recommended_product,
        personalized_message=personalized_message,
        compliance=compliance,
    )


# ---------------------------------------------------------------------------
# GET /analyze/stats  —  dashboard aggregate stats
# ---------------------------------------------------------------------------
@router.get("/stats")
async def get_stats():
    """Return aggregate stats for the dashboard."""
    try:
        users = supabase.table("users").select("id", count="exact").execute()
        offers = supabase.table("offers").select("id, converted, propensity_score", count="exact").execute()

        total_users = users.count or 0
        total_offers = offers.count or 0
        offer_data = offers.data or []

        converted = sum(1 for o in offer_data if o.get("converted"))
        conversion_rate = f"{round((converted / total_offers) * 100, 1)}%" if total_offers > 0 else "0%"

        scores = [float(o["propensity_score"]) for o in offer_data if o.get("propensity_score") is not None]
        avg_propensity = f"{sum(scores) / len(scores):.2f}" if scores else "0.00"

        return {
            "total_users": total_users,
            "total_offers": total_offers,
            "conversion_rate": conversion_rate,
            "avg_propensity": avg_propensity,
        }
    except Exception as e:
        print(f"SUPABASE STATS ERROR: {e}")
        return {
            "total_users": 0,
            "total_offers": 0,
            "conversion_rate": "0%",
            "avg_propensity": "0.00",
        }

