from models.schemas import (
    LifeEvent,
    Product,
    CreditEligibility,
)


class MessageService:
    """Service for generating personalized messages"""

    def generate_message(
        self,
        user_id: str,
        life_event: LifeEvent,
        product: Product,
        credit_eligibility: CreditEligibility,
    ) -> str:
        """
        Generate a personalized marketing message.
        
        Args:
            user_id: User identifier
            life_event: Detected life event
            product: Recommended product
            credit_eligibility: Credit eligibility assessment
            
        Returns:
            Personalized message string
        """
        # Base message components
        greeting = f"Hello! We've analyzed your recent transactions"
        
        # Life event context
        if life_event.event_type.value != "none":
            event_context = (
                f"and noticed you're planning for {life_event.description.lower()}. "
            )
        else:
            event_context = "and have some great opportunities for you. "
        
        # Product recommendation
        product_intro = f"We'd like to introduce you to our {product.name}. "
        product_details = (
            f"This product offers {product.description.lower()}, "
            f"with competitive rates starting at {product.interest_rate}% APR. "
        )
        
        # Benefits highlight
        if product.benefits:
            top_benefit = product.benefits[0]
            benefits = f"Key benefits include {top_benefit.lower()}. "
        else:
            benefits = ""
        
        # Eligibility and call to action
        if credit_eligibility.is_eligible:
            cta = (
                f"Based on your financial profile, you're pre-approved! "
                f"Apply now to get started with {product.name}."
            )
        else:
            cta = (
                f"Learn more about {product.name} and how it can help you "
                f"achieve your financial goals."
            )
        
        # Combine message
        message = (
            f"{greeting} {event_context}"
            f"{product_intro}{product_details}"
            f"{benefits}"
            f"{cta}"
        )
        
        return message
