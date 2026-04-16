"""ML Engine for movie success prediction and analysis"""
import numpy as np
from typing import Dict, List, Tuple
import random

class CineSignalMLEngine:
    """AI/ML engine for film demand intelligence"""
    
    def __init__(self, movie_data: List[Dict]):
        self.movie_data = movie_data
        self.genre_patterns = self._analyze_genre_patterns()
        self.audience_preferences = self._analyze_audience_preferences()
        self.regional_trends = self._analyze_regional_trends()
    
    def predict_success(self, concept: Dict) -> Dict:
        """Predict success score for a film concept"""
        
        # Extract concept parameters
        genres = concept.get("genres", [])
        tone = concept.get("tone", "Dramatic")
        budget_tier = concept.get("budget_tier", "Medium (30-100Cr)")
        release_type = concept.get("release_type", "Theatrical")
        language = concept.get("language", "Hindi")
        star_power = concept.get("star_power", 5)
        novelty_factor = concept.get("novelty_factor", 5)
        family_appeal = concept.get("family_appeal", 5)
        
        # Calculate component scores
        genre_score = self._calculate_genre_score(genres)
        tone_score = self._calculate_tone_score(tone, genres)
        budget_score = self._calculate_budget_score(budget_tier, genres)
        release_score = self._calculate_release_score(release_type, genres)
        star_score = star_power * 10  # Convert to 0-100 scale
        novelty_score = novelty_factor * 10
        family_score = family_appeal * 10
        
        # Regional fit analysis
        india_fit = self._calculate_india_fit(genres, tone, language)
        global_fit = self._calculate_global_fit(genres, tone, language)
        
        # Calculate weighted overall score
        weights = {
            "genre": 0.25,
            "tone": 0.10,
            "budget": 0.10,
            "release": 0.10,
            "star": 0.15,
            "novelty": 0.15,
            "family": 0.15
        }
        
        overall_score = (
            genre_score * weights["genre"] +
            tone_score * weights["tone"] +
            budget_score * weights["budget"] +
            release_score * weights["release"] +
            star_score * weights["star"] +
            novelty_score * weights["novelty"] +
            family_score * weights["family"]
        )
        
        # Calculate market-specific scores
        theatrical_potential = self._calculate_theatrical_potential(overall_score, star_power, genres)
        ott_potential = self._calculate_ott_potential(overall_score, novelty_factor, genres)
        
        # Generate confidence level
        confidence = self._calculate_confidence(genres, star_power, novelty_factor)
        
        # Determine success label
        label = self._get_success_label(overall_score)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(concept, overall_score, india_fit, global_fit)
        
        # Similar successful movies
        similar_movies = self._find_similar_movies(genres, overall_score)
        
        return {
            "overall_score": round(overall_score, 1),
            "label": label,
            "confidence": confidence,
            "market_scores": {
                "india_fit": round(india_fit, 1),
                "global_fit": round(global_fit, 1),
                "theatrical_potential": round(theatrical_potential, 1),
                "ott_potential": round(ott_potential, 1)
            },
            "component_scores": {
                "genre_resonance": round(genre_score, 1),
                "tone_fit": round(tone_score, 1),
                "budget_efficiency": round(budget_score, 1),
                "release_strategy": round(release_score, 1),
                "star_appeal": round(star_score, 1),
                "novelty_factor": round(novelty_score, 1),
                "family_appeal": round(family_score, 1)
            },
            "recommendations": recommendations,
            "similar_successful_movies": similar_movies,
            "target_audience": self._identify_target_audience(genres, tone, family_appeal),
            "risk_factors": self._identify_risk_factors(concept, overall_score)
        }
    
    def _calculate_genre_score(self, genres: List[str]) -> float:
        """Calculate genre resonance score"""
        if not genres:
            return 50.0
        
        # Check for successful patterns
        if len(genres) >= 2:
            pattern_key = tuple(sorted(genres[:2]))
            if pattern_key in self.genre_patterns:
                return self.genre_patterns[pattern_key]["avg_score"]
        
        # Individual genre scores
        genre_scores = {
            "Action": 82, "Drama": 80, "Thriller": 78, "Comedy": 75,
            "Romance": 72, "Crime": 76, "Horror": 70, "Sci-Fi": 68,
            "Fantasy": 65, "Social": 78, "Biographical": 74, "Historical": 72
        }
        
        scores = [genre_scores.get(g, 60) for g in genres]
        return np.mean(scores)
    
    def _calculate_tone_score(self, tone: str, genres: List[str]) -> float:
        """Calculate tone fit score"""
        tone_scores = {
            "Dramatic": 75,
            "Action-Packed": 78,
            "Emotional": 72,
            "Dark": 68,
            "Light": 70,
            "Suspenseful": 76,
            "Humorous": 74
        }
        
        base_score = tone_scores.get(tone, 70)
        
        # Adjust based on genre compatibility
        if tone == "Action-Packed" and "Action" in genres:
            base_score += 10
        if tone == "Emotional" and "Drama" in genres:
            base_score += 8
        if tone == "Suspenseful" and "Thriller" in genres:
            base_score += 10
        
        return min(100, base_score)
    
    def _calculate_budget_score(self, budget_tier: str, genres: List[str]) -> float:
        """Calculate budget efficiency score"""
        budget_scores = {
            "Low (<30Cr)": 70,
            "Medium (30-100Cr)": 75,
            "High (100Cr+)": 80
        }
        
        base_score = budget_scores.get(budget_tier, 70)
        
        # High budget works better for action/VFX heavy genres
        if budget_tier == "High (100Cr+)" and any(g in genres for g in ["Action", "Sci-Fi", "Fantasy"]):
            base_score += 10
        
        # Low budget can work for content-driven films
        if budget_tier == "Low (<30Cr)" and any(g in genres for g in ["Drama", "Thriller", "Horror"]):
            base_score += 8
        
        return min(100, base_score)
    
    def _calculate_release_score(self, release_type: str, genres: List[str]) -> float:
        """Calculate release strategy score"""
        release_scores = {
            "Theatrical": 75,
            "OTT": 78,
            "Hybrid": 80
        }
        
        base_score = release_scores.get(release_type, 75)
        
        # Theatrical works best for big spectacle films
        if release_type == "Theatrical" and any(g in genres for g in ["Action", "Fantasy"]):
            base_score += 10
        
        # OTT works well for content-driven narratives
        if release_type == "OTT" and any(g in genres for g in ["Thriller", "Drama", "Horror"]):
            base_score += 8
        
        return min(100, base_score)
    
    def _calculate_india_fit(self, genres: List[str], tone: str, language: str) -> float:
        """Calculate India market fit"""
        base_score = 70
        
        # High-performing genres in India
        india_strong_genres = ["Action", "Drama", "Social", "Comedy", "Romance", "Biographical"]
        matching_genres = [g for g in genres if g in india_strong_genres]
        base_score += len(matching_genres) * 5
        
        # Language impact
        if language in ["Hindi", "Tamil", "Telugu"]:
            base_score += 10
        elif language in ["Malayalam", "Kannada"]:
            base_score += 5
        
        # Tone preference
        if tone in ["Emotional", "Dramatic", "Action-Packed"]:
            base_score += 5
        
        return min(100, base_score)
    
    def _calculate_global_fit(self, genres: List[str], tone: str, language: str) -> float:
        """Calculate global market fit"""
        base_score = 65
        
        # High-performing genres globally
        global_strong_genres = ["Action", "Sci-Fi", "Thriller", "Fantasy", "Horror"]
        matching_genres = [g for g in genres if g in global_strong_genres]
        base_score += len(matching_genres) * 6
        
        # Language impact
        if language == "English":
            base_score += 15
        elif language in ["Hindi", "Tamil", "Telugu"]:
            base_score += 5  # Growing global interest
        
        # Tone preference
        if tone in ["Action-Packed", "Suspenseful", "Dark"]:
            base_score += 5
        
        return min(100, base_score)
    
    def _calculate_theatrical_potential(self, overall_score: float, star_power: int, genres: List[str]) -> float:
        """Calculate theatrical release potential"""
        base_score = overall_score * 0.7
        
        # Star power matters more for theatrical
        base_score += star_power * 3
        
        # Spectacle genres perform better
        if any(g in genres for g in ["Action", "Fantasy", "Sci-Fi"]):
            base_score += 10
        
        return min(100, base_score)
    
    def _calculate_ott_potential(self, overall_score: float, novelty_factor: int, genres: List[str]) -> float:
        """Calculate OTT platform potential"""
        base_score = overall_score * 0.8
        
        # Novelty and content quality matter more for OTT
        base_score += novelty_factor * 2
        
        # Content-driven genres perform better
        if any(g in genres for g in ["Thriller", "Drama", "Horror", "Mystery"]):
            base_score += 10
        
        return min(100, base_score)
    
    def _calculate_confidence(self, genres: List[str], star_power: int, novelty_factor: int) -> str:
        """Calculate prediction confidence level"""
        confidence_score = 0
        
        # More data points = higher confidence
        if len(genres) >= 2:
            confidence_score += 30
        if star_power >= 7:
            confidence_score += 25
        if novelty_factor >= 6:
            confidence_score += 25
        
        # Pattern recognition
        if len(genres) >= 2:
            pattern_key = tuple(sorted(genres[:2]))
            if pattern_key in self.genre_patterns:
                confidence_score += 20
        
        if confidence_score >= 80:
            return "High"
        elif confidence_score >= 60:
            return "Medium"
        else:
            return "Low"
    
    def _get_success_label(self, score: float) -> str:
        """Get success label from score"""
        if score >= 85:
            return "Blockbuster Potential"
        elif score >= 75:
            return "Strong Commercial Viability"
        elif score >= 65:
            return "Moderate Success Likely"
        elif score >= 55:
            return "Niche Appeal"
        else:
            return "High Risk"
    
    def _generate_recommendations(self, concept: Dict, score: float, india_fit: float, global_fit: float) -> List[str]:
        """Generate strategic recommendations"""
        recommendations = []
        
        genres = concept.get("genres", [])
        release_type = concept.get("release_type", "Theatrical")
        star_power = concept.get("star_power", 5)
        novelty_factor = concept.get("novelty_factor", 5)
        
        # Market targeting
        if india_fit > global_fit + 15:
            recommendations.append("✓ Focus on India-first release strategy - strong domestic appeal")
        elif global_fit > india_fit + 10:
            recommendations.append("✓ Consider global release strategy - high international potential")
        else:
            recommendations.append("✓ Balanced pan-India and global approach recommended")
        
        # Release strategy
        if score >= 80 and any(g in genres for g in ["Action", "Fantasy"]):
            recommendations.append("✓ Theatrical release recommended - high spectacle value")
        elif novelty_factor >= 7 and any(g in genres for g in ["Thriller", "Drama"]):
            recommendations.append("✓ OTT-first release could maximize reach and impact")
        
        # Cast and budget
        if star_power < 6 and score >= 70:
            recommendations.append("⚠ Consider A-list cast to boost theatrical appeal")
        
        if novelty_factor < 6:
            recommendations.append("⚠ Enhance unique elements to stand out in crowded market")
        
        # Genre optimization
        if len(genres) == 1:
            recommendations.append("✓ Consider adding complementary genre for broader appeal")
        
        # Regional expansion
        if concept.get("language") in ["Tamil", "Telugu", "Malayalam"]:
            recommendations.append("✓ Multi-language dubbing recommended for pan-India reach")
        
        return recommendations[:5]  # Top 5 recommendations
    
    def _find_similar_movies(self, genres: List[str], score: float) -> List[Dict]:
        """Find similar successful movies"""
        similar = []
        
        for movie in self.movie_data:
            # Check genre overlap
            overlap = len(set(genres) & set(movie["genres"]))
            if overlap >= 1 and movie["combined_score"] >= 75:
                similarity_score = overlap / max(len(genres), len(movie["genres"]))
                similar.append({
                    "title": movie["title"],
                    "genres": movie["genres"],
                    "score": movie["combined_score"],
                    "box_office": movie["box_office_cr"],
                    "similarity": round(similarity_score * 100, 1)
                })
        
        # Sort by similarity and score
        similar.sort(key=lambda x: (x["similarity"], x["score"]), reverse=True)
        return similar[:5]
    
    def _identify_target_audience(self, genres: List[str], tone: str, family_appeal: int) -> List[str]:
        """Identify target audience segments"""
        audiences = []
        
        if any(g in genres for g in ["Action", "Thriller"]):
            audiences.append("Youth (18-35)")
            audiences.append("Metros")
        
        if any(g in genres for g in ["Drama", "Social", "Biographical"]):
            audiences.append("Families")
            audiences.append("Tier-2 Cities")
        
        if family_appeal >= 7:
            audiences.append("Families")
        
        if tone in ["Dark", "Suspenseful"]:
            audiences.append("Streaming-First")
        
        if any(g in genres for g in ["Romance", "Comedy"]):
            audiences.append("Youth (18-35)")
        
        return list(set(audiences))[:4]
    
    def _identify_risk_factors(self, concept: Dict, score: float) -> List[str]:
        """Identify potential risk factors"""
        risks = []
        
        if score < 65:
            risks.append("Overall market appeal below optimal threshold")
        
        if concept.get("star_power", 5) < 5 and concept.get("budget_tier") == "High (100Cr+)":
            risks.append("High budget with limited star power increases financial risk")
        
        if concept.get("novelty_factor", 5) < 4:
            risks.append("Low novelty may lead to audience fatigue")
        
        genres = concept.get("genres", [])
        if len(genres) > 3:
            risks.append("Too many genres may dilute core narrative focus")
        
        if not risks:
            risks.append("No major risk factors identified")
        
        return risks[:3]
    
    def _analyze_genre_patterns(self) -> Dict:
        """Analyze successful genre combination patterns from data"""
        patterns = {}
        
        for movie in self.movie_data:
            if len(movie["genres"]) >= 2:
                pattern = tuple(sorted(movie["genres"][:2]))
                if pattern not in patterns:
                    patterns[pattern] = {"scores": [], "count": 0}
                patterns[pattern]["scores"].append(movie["combined_score"])
                patterns[pattern]["count"] += 1
        
        # Calculate average scores
        for pattern in patterns:
            patterns[pattern]["avg_score"] = np.mean(patterns[pattern]["scores"])
        
        return patterns
    
    def _analyze_audience_preferences(self) -> Dict:
        """Analyze audience segment preferences"""
        # This would analyze actual viewership data
        # For MVP, return structured insights
        return {
            "metros": ["Action", "Thriller", "Sci-Fi"],
            "tier2": ["Drama", "Social", "Family"],
            "youth": ["Action", "Romance", "Comedy"],
            "families": ["Drama", "Comedy", "Family"]
        }
    
    def _analyze_regional_trends(self) -> Dict:
        """Analyze regional performance trends"""
        trends = {
            "North India": {},
            "South India": {},
            "Pan-India": {},
            "Global": {}
        }
        
        for movie in self.movie_data:
            region = movie["region"]
            if region in trends:
                genre = movie["primary_genre"]
                if genre not in trends[region]:
                    trends[region][genre] = []
                trends[region][genre].append(movie["combined_score"])
        
        # Calculate averages
        for region in trends:
            for genre in trends[region]:
                trends[region][genre] = np.mean(trends[region][genre])
        
        return trends
    
    def get_genre_performance_data(self) -> Dict:
        """Get genre performance analytics for visualization"""
        genre_stats = {}
        
        for movie in self.movie_data:
            genre = movie["primary_genre"]
            if genre not in genre_stats:
                genre_stats[genre] = {
                    "count": 0,
                    "avg_box_office": [],
                    "avg_ott": [],
                    "avg_combined": []
                }
            
            genre_stats[genre]["count"] += 1
            genre_stats[genre]["avg_box_office"].append(movie["box_office_score"])
            genre_stats[genre]["avg_ott"].append(movie["ott_score"])
            genre_stats[genre]["avg_combined"].append(movie["combined_score"])
        
        # Calculate averages
        for genre in genre_stats:
            genre_stats[genre]["avg_box_office"] = round(np.mean(genre_stats[genre]["avg_box_office"]), 1)
            genre_stats[genre]["avg_ott"] = round(np.mean(genre_stats[genre]["avg_ott"]), 1)
            genre_stats[genre]["avg_combined"] = round(np.mean(genre_stats[genre]["avg_combined"]), 1)
        
        return genre_stats
    
    def get_trend_data(self, years: int = 5) -> List[Dict]:
        """Get trend data over years"""
        current_year = 2024
        trend_data = []
        
        for year in range(current_year - years, current_year + 1):
            year_movies = [m for m in self.movie_data if m["year"] == year]
            if year_movies:
                trend_data.append({
                    "year": year,
                    "avg_score": round(np.mean([m["combined_score"] for m in year_movies]), 1),
                    "count": len(year_movies)
                })
        
        return trend_data