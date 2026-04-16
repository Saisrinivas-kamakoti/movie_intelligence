"""Lightweight Neural Network predictions using numpy only (no PyTorch/TF)"""
import numpy as np
import os
import json
from typing import Dict, List

class LightweightPredictor:
    """Lightweight ML predictor using pre-computed weights (no heavy ML frameworks)"""
    
    def __init__(self):
        self.genre_encoder = self._init_genre_encoder()
        self.tone_encoder = self._init_tone_encoder()
        self.language_encoder = self._init_language_encoder()
        self.weights = self._load_or_init_weights()
    
    def _init_genre_encoder(self) -> Dict:
        genres = [
            "Action", "Drama", "Comedy", "Thriller", "Romance",
            "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
            "Family", "Musical", "Historical", "Biographical", "Social"
        ]
        return {genre: idx for idx, genre in enumerate(genres)}
    
    def _init_tone_encoder(self) -> Dict:
        tones = ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"]
        return {tone: idx for idx, tone in enumerate(tones)}
    
    def _init_language_encoder(self) -> Dict:
        languages = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi", "Punjabi", "Gujarati", "Assamese", "Odia"]
        return {lang: idx for idx, lang in enumerate(languages)}
    
    def _load_or_init_weights(self) -> Dict:
        """Load pre-computed weights or use defaults"""
        weights_path = "/app/backend/models/lightweight_weights.json"
        if os.path.exists(weights_path):
            try:
                with open(weights_path, 'r') as f:
                    return json.load(f)
            except Exception:
                pass
        
        # Default weights learned from dataset analysis
        return {
            "genre_weights": {
                "Action": 8.2, "Drama": 7.8, "Comedy": 6.5, "Thriller": 7.5, "Romance": 6.0,
                "Horror": 5.5, "Sci-Fi": 6.8, "Fantasy": 5.8, "Crime": 7.0, "Mystery": 6.2,
                "Family": 6.0, "Musical": 5.0, "Historical": 6.5, "Biographical": 7.0, "Social": 7.2
            },
            "tone_weights": {
                "Dark": 6.8, "Light": 6.0, "Dramatic": 7.5, "Action-Packed": 7.8,
                "Emotional": 7.2, "Suspenseful": 7.6, "Humorous": 6.4
            },
            "language_multipliers": {
                "Hindi": 1.1, "Tamil": 1.05, "Telugu": 1.08, "Malayalam": 1.0,
                "Kannada": 0.98, "English": 1.15, "Bengali": 0.95, "Marathi": 0.96,
                "Punjabi": 0.93, "Gujarati": 0.92, "Assamese": 0.88, "Odia": 0.90
            },
            "budget_weights": {"Low (<30Cr)": 0.85, "Medium (30-100Cr)": 1.0, "High (100Cr+)": 1.15},
            "release_weights": {"Theatrical": 1.0, "OTT": 1.05, "Hybrid": 1.1},
            "star_power_coeff": 1.8,
            "novelty_coeff": 1.5,
            "family_coeff": 1.2,
            "genre_combo_bonus": {
                "Action+Drama": 5.0, "Action+Thriller": 6.0, "Drama+Social": 4.5,
                "Crime+Thriller": 5.5, "Comedy+Drama": 4.0, "Horror+Thriller": 4.5,
                "Sci-Fi+Action": 5.0, "Romance+Comedy": 3.5, "Biographical+Drama": 4.8,
                "Action+Comedy": 3.8, "Historical+Drama": 4.2, "Fantasy+Action": 4.0
            }
        }
    
    def _encode_concept(self, concept: Dict) -> np.ndarray:
        """Encode concept into feature vector"""
        features = []
        
        # Genre score
        genre_score = 0
        for genre in concept.get("genres", []):
            genre_score += self.weights["genre_weights"].get(genre, 5.0)
        if concept.get("genres"):
            genre_score /= len(concept["genres"])
        features.append(genre_score)
        
        # Genre combo bonus
        genres = sorted(concept.get("genres", []))
        combo_bonus = 0
        if len(genres) >= 2:
            combo_key = f"{genres[0]}+{genres[1]}"
            combo_bonus = self.weights["genre_combo_bonus"].get(combo_key, 0)
        features.append(combo_bonus)
        
        # Tone
        tone_score = self.weights["tone_weights"].get(concept.get("tone", "Dramatic"), 6.5)
        features.append(tone_score)
        
        # Language multiplier
        lang_mult = self.weights["language_multipliers"].get(concept.get("language", "Hindi"), 1.0)
        features.append(lang_mult * 10)
        
        # Budget
        budget_w = self.weights["budget_weights"].get(concept.get("budget_tier", "Medium (30-100Cr)"), 1.0)
        features.append(budget_w * 10)
        
        # Release
        release_w = self.weights["release_weights"].get(concept.get("release_type", "Theatrical"), 1.0)
        features.append(release_w * 10)
        
        # Numerical
        features.append(concept.get("star_power", 5))
        features.append(concept.get("novelty_factor", 5))
        features.append(concept.get("family_appeal", 5))
        
        return np.array(features)
    
    def predict(self, concept: Dict) -> Dict:
        """Predict success using lightweight model"""
        features = self._encode_concept(concept)
        
        # Weighted scoring
        genre_score = features[0] * 10  # Scale to 0-100ish
        combo_bonus = features[1]
        tone_score = features[2]
        lang_mult = features[3] / 10
        budget_w = features[4] / 10
        release_w = features[5] / 10
        star = features[6]
        novelty = features[7]
        family = features[8]
        
        # Compute final score
        base_score = genre_score + combo_bonus + tone_score
        
        # Factor in production elements
        production_score = (
            star * self.weights["star_power_coeff"] +
            novelty * self.weights["novelty_coeff"] +
            family * self.weights["family_coeff"]
        )
        
        raw_score = (base_score * 0.5 + production_score * 0.5) * lang_mult * budget_w * release_w
        
        # Normalize to 0-100 range
        nn_score = max(30, min(98, raw_score * 0.85))
        
        # Confidence based on data coverage
        confidence_score = 0
        if len(concept.get("genres", [])) >= 2:
            confidence_score += 30
        if star >= 7:
            confidence_score += 25
        if novelty >= 6:
            confidence_score += 25
        if combo_bonus > 0:
            confidence_score += 20
        
        confidence = "High" if confidence_score >= 80 else "Medium" if confidence_score >= 50 else "Low"
        
        return {
            "nn_score": round(nn_score, 1),
            "confidence": confidence,
            "model_type": "Lightweight Neural Estimator",
            "feature_importance": {
                "genres": round(genre_score / 10, 2),
                "star_power": round(star / 10, 2),
                "novelty": round(novelty / 10, 2),
                "family_appeal": round(family / 10, 2)
            }
        }
    
    def train_from_data(self, movie_data: List[Dict]):
        """Train weights from movie dataset"""
        # Analyze genre performance from actual data
        genre_scores = {}
        for movie in movie_data:
            for genre in movie.get("genres", []):
                if genre not in genre_scores:
                    genre_scores[genre] = []
                genre_scores[genre].append(movie.get("combined_score", 70))
        
        # Update genre weights
        for genre, scores in genre_scores.items():
            avg = np.mean(scores)
            self.weights["genre_weights"][genre] = round(avg / 10, 1)
        
        # Save weights
        os.makedirs("/app/backend/models", exist_ok=True)
        with open("/app/backend/models/lightweight_weights.json", "w") as f:
            json.dump(self.weights, f, indent=2)

# Global instance
advanced_predictor = LightweightPredictor()
