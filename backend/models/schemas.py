from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class TransactionCategory(str, Enum):
    """Transaction categories that indicate life events"""
    HOME_PURCHASE = "home_purchase"
    WEDDING = "wedding"
    EDUCATION = "education"
    MEDICAL = "medical"
    VACATION = "vacation"
    AUTOMOTIVE = "automotive"
    RETAIL = "retail"
    UTILITIES = "utilities"
    GROCERIES = "groceries"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"


class LifeEventType(str, Enum):
    """Types of life events detected"""
    HOME_BUYING = "home_buying"
    MARRIAGE = "marriage"
    EDUCATION_PLANNING = "education_planning"
    MEDICAL_EMERGENCY = "medical_emergency"
    VACATION_PLANNING = "vacation_planning"
    VEHICLE_PURCHASE = "vehicle_purchase"
    NONE = "none"


class ProductType(str, Enum):
    """Types of banking products"""
    HOME_LOAN = "home_loan"
    PERSONAL_LOAN = "personal_loan"
    CREDIT_CARD = "credit_card"
    SAVINGS_ACCOUNT = "savings_account"
    INVESTMENT_ACCOUNT = "investment_account"
    INSURANCE = "insurance"
    EDUCATION_LOAN = "education_loan"
    AUTO_LOAN = "auto_loan"


class ComplianceStatusEnum(str, Enum):
    """Compliance validation status"""
    APPROVED = "approved"
    PENDING = "pending"
    REJECTED = "rejected"


class TransactionData(BaseModel):
    """Individual transaction data"""
    amount: float = Field(..., gt=0, description="Transaction amount")
    category: TransactionCategory = Field(..., description="Transaction category")
    date: datetime = Field(..., description="Transaction date")
    merchant: Optional[str] = Field(None, description="Merchant name")
    description: Optional[str] = Field(None, description="Transaction description")


class LifeEvent(BaseModel):
    """Detected life event information"""
    event_type: LifeEventType = Field(..., description="Type of life event")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    detected_from: List[TransactionCategory] = Field(..., description="Categories that triggered detection")
    description: str = Field(..., description="Description of the life event")


class CreditEligibility(BaseModel):
    """Credit eligibility assessment"""
    is_eligible: bool = Field(..., description="Whether user is eligible for credit")
    credit_score: Optional[int] = Field(None, ge=300, le=850, description="Estimated credit score")
    max_loan_amount: Optional[float] = Field(None, ge=0, description="Maximum eligible loan amount")
    interest_rate: Optional[float] = Field(None, ge=0, le=100, description="Estimated interest rate percentage")
    reason: str = Field(..., description="Reason for eligibility decision")


class Product(BaseModel):
    """Banking product information"""
    product_id: str = Field(..., description="Unique product identifier")
    product_type: ProductType = Field(..., description="Type of product")
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    interest_rate: float = Field(..., ge=0, description="Interest rate percentage")
    min_amount: float = Field(..., ge=0, description="Minimum amount")
    max_amount: Optional[float] = Field(None, ge=0, description="Maximum amount")
    eligibility_criteria: List[str] = Field(..., description="Eligibility criteria")
    benefits: List[str] = Field(..., description="Product benefits")


class ComplianceStatus(BaseModel):
    """Compliance validation result"""
    status: ComplianceStatusEnum = Field(..., description="Compliance status")
    validated_at: datetime = Field(default_factory=datetime.now, description="Validation timestamp")
    checks_passed: List[str] = Field(..., description="List of checks that passed")
    checks_failed: List[str] = Field(default_factory=list, description="List of checks that failed")
    notes: Optional[str] = Field(None, description="Additional compliance notes")


class AnalysisRequest(BaseModel):
    """Request model for /analyze endpoint"""
    user_id: str = Field(..., description="User identifier")
    transactions: List[TransactionData] = Field(..., min_items=1, description="List of user transactions")
    current_balance: Optional[float] = Field(None, ge=0, description="Current account balance")
    annual_income: Optional[float] = Field(None, ge=0, description="Annual income")


class AnalysisResponse(BaseModel):
    """Response model for /analyze endpoint"""
    user_id: str = Field(..., description="User identifier")
    life_event: LifeEvent = Field(..., description="Detected life event")
    credit_eligibility: CreditEligibility = Field(..., description="Credit eligibility assessment")
    recommended_product: Product = Field(..., description="Recommended product")
    personalized_message: str = Field(..., description="Personalized marketing message")
    compliance: ComplianceStatus = Field(..., description="Compliance validation result")
    analyzed_at: datetime = Field(default_factory=datetime.now, description="Analysis timestamp")
