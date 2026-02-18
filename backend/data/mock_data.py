from typing import Dict, List
from models.schemas import (
    Product,
    ProductType,
    LifeEventType,
    TransactionCategory,
)


# Mock customer profile
MOCK_CUSTOMER = {
    "name": "Rahul Sharma",
    "avatar": "RS",
    "creditScore": 750,
    "maxCreditScore": 900,
    "riskCategory": "Low",
    "activeProducts": ["Savings Account"],
    "customerId": "CUST-2024-78432",
    "memberSince": "March 2019",
}

# Mock transactions for frontend display
MOCK_TRANSACTIONS = [
    {
        "id": 1,
        "description": "International Travel Booking",
        "amount": 50000,
        "category": "vacation",
        "icon": "✈️",
        "date": "2024-12-15",
        "type": "debit",
    },
    {
        "id": 2,
        "description": "Electronics Store",
        "amount": 12000,
        "category": "retail",
        "icon": "🛒",
        "date": "2024-12-14",
        "type": "debit",
    },
    {
        "id": 3,
        "description": "Restaurant",
        "amount": 8000,
        "category": "entertainment",
        "icon": "🍽️",
        "date": "2024-12-13",
        "type": "debit",
    },
]


# Mock product catalog
PRODUCTS: List[Product] = [
    Product(
        product_id="home_loan_001",
        product_type=ProductType.HOME_LOAN,
        name="Dream Home Loan",
        description="Low-interest home loan for first-time buyers",
        interest_rate=6.5,
        min_amount=100000.0,
        max_amount=5000000.0,
        eligibility_criteria=[
            "Minimum credit score: 650",
            "Minimum annual income: $50,000",
            "Down payment: 20%",
        ],
        benefits=[
            "Flexible repayment options",
            "No prepayment penalty",
            "Tax benefits on interest",
        ],
    ),
    Product(
        product_id="personal_loan_001",
        product_type=ProductType.PERSONAL_LOAN,
        name="Flexi Personal Loan",
        description="Unsecured personal loan for various needs",
        interest_rate=12.5,
        min_amount=10000.0,
        max_amount=500000.0,
        eligibility_criteria=[
            "Minimum credit score: 600",
            "Minimum annual income: $30,000",
        ],
        benefits=[
            "Quick approval",
            "No collateral required",
            "Flexible tenure",
        ],
    ),
    Product(
        product_id="credit_card_001",
        product_type=ProductType.CREDIT_CARD,
        name="Premium Rewards Card",
        description="Credit card with cashback and rewards",
        interest_rate=18.0,
        min_amount=0.0,
        max_amount=100000.0,
        eligibility_criteria=[
            "Minimum credit score: 650",
            "Minimum annual income: $40,000",
        ],
        benefits=[
            "5% cashback on dining",
            "Travel rewards",
            "Zero annual fee for first year",
        ],
    ),
    Product(
        product_id="education_loan_001",
        product_type=ProductType.EDUCATION_LOAN,
        name="Student Success Loan",
        description="Education loan for students and parents",
        interest_rate=8.5,
        min_amount=50000.0,
        max_amount=2000000.0,
        eligibility_criteria=[
            "Minimum credit score: 620",
            "Admission to recognized institution",
        ],
        benefits=[
            "Moratorium period during studies",
            "Tax benefits",
            "Low interest rates",
        ],
    ),
    Product(
        product_id="auto_loan_001",
        product_type=ProductType.AUTO_LOAN,
        name="Drive Easy Auto Loan",
        description="Competitive rates for vehicle purchase",
        interest_rate=7.5,
        min_amount=50000.0,
        max_amount=2000000.0,
        eligibility_criteria=[
            "Minimum credit score: 600",
            "Minimum annual income: $35,000",
        ],
        benefits=[
            "Quick processing",
            "Flexible down payment",
            "Insurance options",
        ],
    ),
    Product(
        product_id="savings_001",
        product_type=ProductType.SAVINGS_ACCOUNT,
        name="High Yield Savings",
        description="Savings account with competitive interest rates",
        interest_rate=4.5,
        min_amount=1000.0,
        max_amount=None,
        eligibility_criteria=[
            "Minimum balance: $1,000",
        ],
        benefits=[
            "High interest rate",
            "No monthly fees",
            "Easy online access",
        ],
    ),
]

# Mapping transaction categories to life events
TRANSACTION_CATEGORY_TO_LIFE_EVENT: Dict[TransactionCategory, LifeEventType] = {
    TransactionCategory.HOME_PURCHASE: LifeEventType.HOME_BUYING,
    TransactionCategory.WEDDING: LifeEventType.MARRIAGE,
    TransactionCategory.EDUCATION: LifeEventType.EDUCATION_PLANNING,
    TransactionCategory.MEDICAL: LifeEventType.MEDICAL_EMERGENCY,
    TransactionCategory.VACATION: LifeEventType.VACATION_PLANNING,
    TransactionCategory.AUTOMOTIVE: LifeEventType.VEHICLE_PURCHASE,
    TransactionCategory.RETAIL: LifeEventType.NONE,
    TransactionCategory.UTILITIES: LifeEventType.NONE,
    TransactionCategory.GROCERIES: LifeEventType.NONE,
    TransactionCategory.ENTERTAINMENT: LifeEventType.NONE,
    TransactionCategory.OTHER: LifeEventType.NONE,
}

# Credit score ranges for eligibility assessment
CREDIT_SCORE_RANGES = {
    "excellent": (750, 850),
    "good": (700, 749),
    "fair": (650, 699),
    "poor": (600, 649),
    "very_poor": (300, 599),
}

# Life event to product type mapping
LIFE_EVENT_TO_PRODUCT_TYPE: Dict[LifeEventType, ProductType] = {
    LifeEventType.HOME_BUYING: ProductType.HOME_LOAN,
    LifeEventType.MARRIAGE: ProductType.PERSONAL_LOAN,
    LifeEventType.EDUCATION_PLANNING: ProductType.EDUCATION_LOAN,
    LifeEventType.MEDICAL_EMERGENCY: ProductType.PERSONAL_LOAN,
    LifeEventType.VACATION_PLANNING: ProductType.CREDIT_CARD,
    LifeEventType.VEHICLE_PURCHASE: ProductType.AUTO_LOAN,
    LifeEventType.NONE: ProductType.SAVINGS_ACCOUNT,
}
