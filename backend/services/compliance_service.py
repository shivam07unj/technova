from datetime import datetime
from models.schemas import (
    ComplianceStatusEnum,
    ComplianceStatus,
    AnalysisRequest,
    Product,
    CreditEligibility,
)


class ComplianceService:
    """Service for compliance validation"""

    def validate_compliance(
        self,
        request: AnalysisRequest,
        product: Product,
        credit_eligibility: CreditEligibility,
    ) -> ComplianceStatus:
        """
        Run compliance validation checks.
        
        Args:
            request: Original analysis request
            product: Recommended product
            credit_eligibility: Credit eligibility assessment
            
        Returns:
            ComplianceStatus with validation results
        """
        checks_passed = []
        checks_failed = []
        notes = []
        
        # Check 1: User ID validation
        if request.user_id and len(request.user_id) > 0:
            checks_passed.append("User ID validation")
        else:
            checks_failed.append("User ID validation")
            notes.append("Invalid user ID provided")
        
        # Check 2: Transaction data validation
        if request.transactions and len(request.transactions) > 0:
            checks_passed.append("Transaction data validation")
        else:
            checks_failed.append("Transaction data validation")
            notes.append("No transaction data provided")
        
        # Check 3: Product eligibility check
        if credit_eligibility.is_eligible:
            checks_passed.append("Product eligibility check")
        else:
            checks_failed.append("Product eligibility check")
            notes.append("User does not meet product eligibility requirements")
        
        # Check 4: Credit limit validation
        if credit_eligibility.max_loan_amount:
            if product.max_amount:
                if credit_eligibility.max_loan_amount <= product.max_amount:
                    checks_passed.append("Credit limit validation")
                else:
                    checks_failed.append("Credit limit validation")
                    notes.append(
                        f"Requested amount exceeds product limit of {product.max_amount}"
                    )
            else:
                checks_passed.append("Credit limit validation")
        else:
            checks_passed.append("Credit limit validation")
        
        # Check 5: Interest rate disclosure
        if product.interest_rate is not None:
            checks_passed.append("Interest rate disclosure")
        else:
            checks_failed.append("Interest rate disclosure")
            notes.append("Product interest rate not disclosed")
        
        # Check 6: Terms and conditions
        if product.eligibility_criteria and len(product.eligibility_criteria) > 0:
            checks_passed.append("Terms and conditions disclosure")
        else:
            checks_failed.append("Terms and conditions disclosure")
            notes.append("Product terms not fully disclosed")
        
        # Determine overall status
        # Approved if no critical checks failed
        critical_checks = [
            "User ID validation",
            "Transaction data validation",
            "Product eligibility check",
        ]
        
        critical_failed = any(
            check in checks_failed for check in critical_checks
        )
        
        if critical_failed:
            status = ComplianceStatusEnum.REJECTED
        elif len(checks_failed) > 0:
            status = ComplianceStatusEnum.PENDING
        else:
            status = ComplianceStatusEnum.APPROVED
        
        # Add summary note
        if status == ComplianceStatusEnum.APPROVED:
            notes.append("All compliance checks passed successfully")
        elif status == ComplianceStatusEnum.PENDING:
            notes.append("Some non-critical checks require attention")
        else:
            notes.append("Critical compliance checks failed")
        
        return ComplianceStatus(
            status=status,
            validated_at=datetime.now(),
            checks_passed=checks_passed,
            checks_failed=checks_failed,
            notes="; ".join(notes) if notes else None,
        )
