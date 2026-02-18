from models.schemas import (
    Product,
    ProductType,
    LifeEventType,
    CreditEligibility,
)
from data.mock_data import PRODUCTS, LIFE_EVENT_TO_PRODUCT_TYPE


class ProductSelectionService:
    """Service for selecting the best product for a user"""

    def select_best_product(
        self,
        life_event_type: LifeEventType,
        credit_eligibility: CreditEligibility,
    ) -> Product:
        """
        Select the best product based on life event and credit eligibility.
        
        Args:
            life_event_type: Detected life event type
            credit_eligibility: Credit eligibility assessment
            
        Returns:
            Best matching Product
        """
        # Get preferred product type based on life event
        preferred_product_type = LIFE_EVENT_TO_PRODUCT_TYPE.get(
            life_event_type, ProductType.SAVINGS_ACCOUNT
        )
        
        # Filter products by type
        matching_products = [
            p for p in PRODUCTS if p.product_type == preferred_product_type
        ]
        
        # If no products match the preferred type, use all products
        if not matching_products:
            matching_products = PRODUCTS
        
        # Filter by eligibility
        eligible_products = []
        for product in matching_products:
            if self._is_product_eligible(product, credit_eligibility):
                eligible_products.append(product)
        
        # If no eligible products, return the first matching product anyway
        # (in production, this might trigger a different flow)
        if not eligible_products:
            eligible_products = matching_products
        
        # Select best product based on:
        # 1. Lowest interest rate (for loans)
        # 2. Best match to credit eligibility
        best_product = eligible_products[0]
        
        if credit_eligibility.is_eligible:
            # For loans, prefer lower interest rate
            if best_product.product_type in [
                ProductType.HOME_LOAN,
                ProductType.PERSONAL_LOAN,
                ProductType.EDUCATION_LOAN,
                ProductType.AUTO_LOAN,
            ]:
                best_product = min(
                    eligible_products,
                    key=lambda p: p.interest_rate,
                )
            
            # Ensure product max amount is within credit eligibility
            if (
                credit_eligibility.max_loan_amount
                and best_product.max_amount
                and best_product.max_amount > credit_eligibility.max_loan_amount
            ):
                # Find a product with max_amount closer to eligibility
                suitable_products = [
                    p
                    for p in eligible_products
                    if not p.max_amount or p.max_amount <= credit_eligibility.max_loan_amount
                ]
                if suitable_products:
                    best_product = suitable_products[0]
        
        return best_product
    
    def _is_product_eligible(
        self, product: Product, credit_eligibility: CreditEligibility
    ) -> bool:
        """
        Check if a product is eligible based on credit assessment.
        
        Args:
            product: Product to check
            credit_eligibility: Credit eligibility assessment
            
        Returns:
            True if product is eligible
        """
        if not credit_eligibility.is_eligible:
            # Only savings accounts might be available
            return product.product_type == ProductType.SAVINGS_ACCOUNT
        
        # Check if credit score meets product requirements
        # (In production, this would be more sophisticated)
        if credit_eligibility.credit_score:
            # Simple heuristic: products with higher interest rates
            # typically require lower credit scores
            if product.interest_rate >= 15.0:
                return credit_eligibility.credit_score >= 600
            elif product.interest_rate >= 10.0:
                return credit_eligibility.credit_score >= 650
            else:
                return credit_eligibility.credit_score >= 700
        
        return True
