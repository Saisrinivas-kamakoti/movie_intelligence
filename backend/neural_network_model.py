"""Neural Network model for advanced predictions"""
import torch
import torch.nn as nn
import numpy as np
from typing import Dict, List
import pickle
import os

class CineSignalNeuralNet(nn.Module):
    """Neural network for movie success prediction"""
    
    def __init__(self, input_size=50, hidden_size=128):
        super(CineSignalNeuralNet, self).__init__()
        
        self.layers = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        return self.layers(x)

class AdvancedMLPredictor:
    """Advanced ML predictor using neural networks"""
    
    def __init__(self):
        self.model = None
        self.genre_encoder = self._init_genre_encoder()
        self.tone_encoder = self._init_tone_encoder()
        self.language_encoder = self._init_language_encoder()
        self._load_model()
    
    def _init_genre_encoder(self) -> Dict:
        """Initialize genre one-hot encoder"""
        genres = [
            "Action", "Drama", "Comedy", "Thriller", "Romance",
            "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
            "Family", "Musical", "Historical", "Biographical", "Social"
        ]
        return {genre: idx for idx, genre in enumerate(genres)}
    
    def _init_tone_encoder(self) -> Dict:
        """Initialize tone encoder"""
        tones = ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"]
        return {tone: idx for idx, tone in enumerate(tones)}
    
    def _init_language_encoder(self) -> Dict:
        """Initialize language encoder"""
        languages = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi"]
        return {lang: idx for idx, lang in enumerate(languages)}
    
    def _load_model(self):
        """Load pre-trained model if exists"""
        model_path = "/app/backend/models/neural_net.pth"
        if os.path.exists(model_path):
            try:
                self.model = CineSignalNeuralNet()
                self.model.load_state_dict(torch.load(model_path))
                self.model.eval()
            except:
                pass
    
    def _encode_concept(self, concept: Dict) -> np.ndarray:
        """Encode concept into feature vector"""
        features = np.zeros(50)
        
        # Genre encoding (15 features)
        for genre in concept.get("genres", []):
            if genre in self.genre_encoder:
                features[self.genre_encoder[genre]] = 1.0
        
        # Tone encoding (7 features, offset 15)
        tone = concept.get("tone", "Dramatic")
        if tone in self.tone_encoder:
            features[15 + self.tone_encoder[tone]] = 1.0
        
        # Budget encoding (3 features, offset 22)
        budget_map = {"Low (<30Cr)": 0, "Medium (30-100Cr)": 1, "High (100Cr+)": 2}
        budget_idx = budget_map.get(concept.get("budget_tier", "Medium (30-100Cr)"), 1)
        features[22 + budget_idx] = 1.0
        
        # Release type (3 features, offset 25)
        release_map = {"Theatrical": 0, "OTT": 1, "Hybrid": 2}
        release_idx = release_map.get(concept.get("release_type", "Theatrical"), 0)
        features[25 + release_idx] = 1.0
        
        # Language encoding (8 features, offset 28)
        language = concept.get("language", "Hindi")
        if language in self.language_encoder:
            features[28 + self.language_encoder[language]] = 1.0
        
        # Numerical features (offset 36)
        features[36] = concept.get("star_power", 5) / 10.0
        features[37] = concept.get("novelty_factor", 5) / 10.0
        features[38] = concept.get("family_appeal", 5) / 10.0
        
        # Interaction features (remaining features)
        # Genre count
        features[39] = len(concept.get("genres", [])) / 3.0
        
        # Action-heavy indicator
        features[40] = 1.0 if "Action" in concept.get("genres", []) else 0.0
        
        # Drama indicator
        features[41] = 1.0 if "Drama" in concept.get("genres", []) else 0.0
        
        # Indian language indicator
        indian_langs = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi"]
        features[42] = 1.0 if concept.get("language") in indian_langs else 0.0
        
        # High budget + Action combination
        features[43] = 1.0 if (concept.get("budget_tier") == "High (100Cr+)" and 
                               "Action" in concept.get("genres", [])) else 0.0
        
        return features
    
    def predict(self, concept: Dict) -> Dict:
        """Make prediction using neural network"""
        
        # If model not loaded, return fallback
        if self.model is None:
            return self._fallback_prediction(concept)
        
        # Encode concept
        features = self._encode_concept(concept)
        features_tensor = torch.FloatTensor(features).unsqueeze(0)
        
        # Make prediction
        with torch.no_grad():
            prediction = self.model(features_tensor)
            score = float(prediction.item()) * 100
        
        # Generate detailed results
        return {
            "nn_score": round(score, 1),
            "confidence": "High" if score > 75 else "Medium" if score > 60 else "Low",
            "model_type": "Neural Network",
            "feature_importance": self._get_feature_importance(features)
        }
    
    def _fallback_prediction(self, concept: Dict) -> Dict:
        """Fallback prediction when model not available"""
        # Simple heuristic
        score = 70.0
        
        # Adjust based on genres
        if "Action" in concept.get("genres", []):
            score += 5
        if "Drama" in concept.get("genres", []):
            score += 3
        
        # Adjust based on other factors
        score += concept.get("star_power", 5) * 1.5
        score += concept.get("novelty_factor", 5) * 1.0
        
        return {
            "nn_score": min(100, round(score, 1)),
            "confidence": "Medium",
            "model_type": "Heuristic (Neural Network not loaded)",
            "feature_importance": {}
        }
    
    def _get_feature_importance(self, features: np.ndarray) -> Dict:
        """Calculate feature importance"""
        importance = {}
        
        # Genre features
        active_genres = np.sum(features[:15])
        importance["genres"] = float(active_genres / 3.0) if active_genres > 0 else 0.0
        
        # Star power
        importance["star_power"] = float(features[36])
        
        # Novelty
        importance["novelty"] = float(features[37])
        
        # Family appeal
        importance["family_appeal"] = float(features[38])
        
        return importance

# Global instance
advanced_predictor = AdvancedMLPredictor()