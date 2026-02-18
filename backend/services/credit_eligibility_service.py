from typing import List, Optional
from models.schemas import (
    TransactionData,
    CreditEligibility,
    LifeEventType,
)
from data.mock_data import CREDIT_SCORE_RANGES


class CreditEligibilityService:
    """Service for assessing credit eligibility"""

    def check_eligibility(
        self,
        transactions: List[TransactionData],
        annual_income: Optional[float] = None,
        current_balance: Optional[float] = None,
        life_event_type: LifeEventType = LifeEventType.NONE,
    ) -> CreditEligibility:
        """
        Assess credit eligibility based on transaction history and user data.
        
        Args:
            transactions: List of user transactions
            annual_income: User's annual income
            current_balance: Current account balance
            life_event_type: Detected life event type
            
        Returns:
            CreditEligibility object with assessment results
        """
        # Calculate estimated credit score based on:
        # 1. Transaction history (regularity, amounts)
        # 2. Account balance
        # 3. Income level
        
        base_score = 600  # Base credit score
        
        # Factor 1: Transaction regularity (more transactions = better)
        if len(transactions) >= 10:
            base_score += 50
        elif len(transactions) >= 5:
            base_score += 30
        elif len(transactions) >= 3:
            base_score += 10
        
        # Factor 2: Account balance (higher balance = better)
        if current_balance:
            if current_balance >= 100000:
                base_score += 100
            elif current_balance >= 50000:
                base_score += 60
            elif current_balance >= 10000:
                base_score += 30
            elif current_balance >= 1000:
                base_score += 10
        
        # Factor 3: Income level (higher income = better)
        if annual_income:
            if annual_income >= 100000:
                base_score += 80
            elif annual_income >= 75000:
                base_score += 50
            elif annual_income >= 50000:
                base_score += 30
            elif annual_income >= 30000:
                base_score += 10
        
        # Factor 4: Transaction amounts (consistent spending = better)
        if transactions:
            avg_amount = sum(t.amount for t in transactions) / len(transactions)
            if avg_amount >= 10000:
                base_score += 40
            elif avg_amount >= 5000:
                base_score += 20
            elif avg_amount >= 1000:
                base_score += 10
        
        # Cap the score at 850
        credit_score = min(base_score, 850)
        
        # Determine eligibility
        is_eligible = credit_score >= 600
        
        # Calculate max loan amount based on income and credit score
        max_loan_amount = None
        interest_rate = None
        
        if is_eligible:
            # Base loan amount on income (typically 3-5x annual income)
            if annual_income:
                multiplier = 3.0
                if credit_score >= 750:
                    multiplier = 5.0
                elif credit_score >= 700:
                    multiplier = 4.0
                elif credit_score >= 650:
                    multiplier = 3.5
                
                max_loan_amount = annual_income * multiplier
            else:
                # Estimate based on credit score if no income data
                if credit_score >= 750:
                    max_loan_amount = 500000.0
                elif credit_score >= 700:
                    max_loan_amount = 300000.0
                elif credit_score >= 650:
                    max_loan_amount = 200000.0
                else:
                    max_loan_amount = 100000.0
            
            # Calculate interest rate based on credit score
            if credit_score >= 750:
                interest_rate = 6.0
            elif credit_score >= 700:
                interest_rate = 8.0
            elif credit_score >= 650:
                interest_rate = 10.0
            else:
                interest_rate = 12.0
        else:
            max_loan_amount = 0.0
            interest_rate = None
        
        # Generate reason
        if is_eligible:
            score_range = self._get_score_range(credit_score)
            reason = (
                f"Eligible for credit products. "
                f"Credit score: {credit_score} ({score_range}). "
                f"Based on transaction history and financial profile."
            )
        else:
            reason = (
                f"Not currently eligible. "
                f"Credit score: {credit_score}. "
                f"Improve credit history and account stability to become eligible."
            )
        
        return CreditEligibility(
            is_eligible=is_eligible,
            credit_score=credit_score,
            max_loan_amount=max_loan_amount,
            interest_rate=interest_rate,
            reason=reason,
        )
    
    def _get_score_range(self, score: int) -> str:
        """Get credit score range description"""
        for range_name, (min_score, max_score) in CREDIT_SCORE_RANGES.items():
            if min_score <= score <= max_score:
                return range_name.replace("_", " ").title()
        return "Unknown"
