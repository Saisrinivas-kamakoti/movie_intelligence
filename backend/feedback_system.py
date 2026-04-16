"""Feedback and improvement tracking system"""
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional
from pydantic import BaseModel

class Feedback(BaseModel):
    """User feedback model"""
    id: str = None
    user_email: Optional[str] = None
    concept: Dict
    prediction: Dict
    actual_result: Optional[Dict] = None
    rating: int  # 1-5 stars
    comments: Optional[str] = None
    timestamp: str = None
    
    def __init__(self, **data):
        if 'id' not in data or data['id'] is None:
            data['id'] = str(uuid.uuid4())
        if 'timestamp' not in data or data['timestamp'] is None:
            data['timestamp'] = datetime.now(timezone.utc).isoformat()
        super().__init__(**data)

class FeedbackSystem:
    """Feedback collection and analysis system"""
    
    def __init__(self, db):
        self.db = db
        self.feedback_collection = db.feedback
    
    async def submit_feedback(self, feedback: Feedback) -> str:
        """Submit user feedback"""
        feedback_dict = feedback.model_dump()
        await self.feedback_collection.insert_one(feedback_dict)
        return feedback.id
    
    async def get_feedback_stats(self) -> Dict:
        """Get feedback statistics"""
        total = await self.feedback_collection.count_documents({})
        
        if total == 0:
            return {
                "total_feedback": 0,
                "avg_rating": 0,
                "rating_distribution": {},
                "accuracy_metrics": {}
            }
        
        # Get all feedback
        feedback_list = await self.feedback_collection.find({}).to_list(1000)
        
        # Calculate ratings
        ratings = [f['rating'] for f in feedback_list]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        
        rating_dist = {}
        for i in range(1, 6):
            rating_dist[str(i)] = ratings.count(i)
        
        # Calculate accuracy metrics
        accurate_predictions = 0
        total_with_results = 0
        
        for fb in feedback_list:
            if fb.get('actual_result'):
                total_with_results += 1
                predicted_score = fb['prediction']['overall_score']
                actual_score = fb['actual_result'].get('actual_score', 0)
                
                # Consider accurate if within 15 points
                if abs(predicted_score - actual_score) <= 15:
                    accurate_predictions += 1
        
        accuracy_rate = (accurate_predictions / total_with_results * 100) if total_with_results > 0 else 0
        
        return {
            "total_feedback": total,
            "avg_rating": round(avg_rating, 2),
            "rating_distribution": rating_dist,
            "accuracy_metrics": {
                "total_with_results": total_with_results,
                "accurate_predictions": accurate_predictions,
                "accuracy_rate": round(accuracy_rate, 1)
            }
        }
    
    async def get_improvement_insights(self) -> List[Dict]:
        """Get insights for model improvement"""
        feedback_list = await self.feedback_collection.find({}).to_list(1000)
        
        insights = []
        
        # Analyze low-rated predictions
        low_rated = [f for f in feedback_list if f['rating'] <= 2]
        if low_rated:
            insights.append({
                "type": "low_rated_predictions",
                "count": len(low_rated),
                "common_patterns": self._analyze_patterns(low_rated)
            })
        
        # Analyze inaccurate predictions
        inaccurate = []
        for fb in feedback_list:
            if fb.get('actual_result'):
                predicted = fb['prediction']['overall_score']
                actual = fb['actual_result'].get('actual_score', 0)
                if abs(predicted - actual) > 20:
                    inaccurate.append(fb)
        
        if inaccurate:
            insights.append({
                "type": "inaccurate_predictions",
                "count": len(inaccurate),
                "avg_error": self._calculate_avg_error(inaccurate)
            })
        
        return insights
    
    def _analyze_patterns(self, feedback_list: List[Dict]) -> Dict:
        """Analyze common patterns in feedback"""
        patterns = {
            "genres": {},
            "budget_tiers": {},
            "languages": {}
        }
        
        for fb in feedback_list:
            concept = fb['concept']
            
            # Genre patterns
            for genre in concept.get('genres', []):
                patterns['genres'][genre] = patterns['genres'].get(genre, 0) + 1
            
            # Budget patterns
            budget = concept.get('budget_tier', '')
            patterns['budget_tiers'][budget] = patterns['budget_tiers'].get(budget, 0) + 1
            
            # Language patterns
            lang = concept.get('language', '')
            patterns['languages'][lang] = patterns['languages'].get(lang, 0) + 1
        
        return patterns
    
    def _calculate_avg_error(self, feedback_list: List[Dict]) -> float:
        """Calculate average prediction error"""
        errors = []
        for fb in feedback_list:
            predicted = fb['prediction']['overall_score']
            actual = fb['actual_result'].get('actual_score', 0)
            errors.append(abs(predicted - actual))
        
        return round(sum(errors) / len(errors), 1) if errors else 0
