from typing import Dict, List
from models.schemas import (
    TransactionData,
    TransactionCategory,
    LifeEvent,
    LifeEventType,
)
from data.mock_data import TRANSACTION_CATEGORY_TO_LIFE_EVENT


class LifeEventService:
    """Service for detecting life events from transaction data"""

    def detect_life_event(self, transactions: List[TransactionData]) -> LifeEvent:
        """
        Detect life event based on transaction categories.
        
        Args:
            transactions: List of user transactions
            
        Returns:
            LifeEvent object with detected event information
        """
        # Count occurrences of each category
        category_counts: Dict[TransactionCategory, int] = {}
        
        for transaction in transactions:
            category = transaction.category
            category_counts[category] = category_counts.get(category, 0) + 1
        
        # Find the most significant category (highest count or highest amount)
        if not category_counts:
            return LifeEvent(
                event_type=LifeEventType.NONE,
                confidence=0.0,
                detected_from=[],
                description="No significant life event detected",
            )
        
        # Find category with highest total amount
        category_amounts: Dict[TransactionCategory, float] = {}
        for transaction in transactions:
            category = transaction.category
            category_amounts[category] = category_amounts.get(category, 0.0) + transaction.amount
        
        # Get the category with highest total amount
        significant_category = max(category_amounts.items(), key=lambda x: x[1])[0]
        
        # Map category to life event
        event_type = TRANSACTION_CATEGORY_TO_LIFE_EVENT.get(
            significant_category, LifeEventType.NONE
        )
        
        # Calculate confidence based on:
        # 1. Number of transactions in that category
        # 2. Total amount in that category relative to all transactions
        total_amount = sum(t.amount for t in transactions)
        category_amount = category_amounts[significant_category]
        amount_ratio = category_amount / total_amount if total_amount > 0 else 0.0
        
        # Confidence increases with amount ratio and transaction count
        count_ratio = category_counts[significant_category] / len(transactions)
        confidence = min(0.5 * amount_ratio + 0.5 * count_ratio, 1.0)
        
        # If it's a significant category, boost confidence
        if event_type != LifeEventType.NONE:
            confidence = min(confidence + 0.3, 1.0)
        
        # Build description
        descriptions = {
            LifeEventType.HOME_BUYING: "Recent home purchase transactions detected. Consider our home loan options.",
            LifeEventType.MARRIAGE: "Wedding-related expenses detected. We have special offers for newlyweds.",
            LifeEventType.EDUCATION_PLANNING: "Education expenses detected. Explore our education loan options.",
            LifeEventType.MEDICAL_EMERGENCY: "Medical expenses detected. We can help with financing options.",
            LifeEventType.VACATION_PLANNING: "Travel expenses detected. Consider our travel credit card.",
            LifeEventType.VEHICLE_PURCHASE: "Automotive expenses detected. Check out our auto loan options.",
            LifeEventType.NONE: "No specific life event detected from current transactions.",
        }
        
        detected_categories = [
            cat for cat, count in category_counts.items()
            if count > 0 and TRANSACTION_CATEGORY_TO_LIFE_EVENT.get(cat) == event_type
        ]
        
        return LifeEvent(
            event_type=event_type,
            confidence=round(confidence, 2),
            detected_from=detected_categories if detected_categories else [significant_category],
            description=descriptions[event_type],
        )
