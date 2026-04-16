"""Comprehensive movie dataset with Indian and Global movies"""
import random
from typing import List, Dict
import uuid

# Genre definitions
GENRES = [
    "Action", "Drama", "Comedy", "Thriller", "Romance", 
    "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
    "Family", "Musical", "Historical", "Biographical", "Social"
]

TONES = ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"]
RELEASE_TYPES = ["Theatrical", "OTT", "Hybrid"]
LANGUAGES = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi", "Punjabi", "Gujarati", "Assamese", "Odia"]
REGIONS = ["North India", "South India", "Pan-India", "Global"]

class MovieDataset:
    """Generate and manage comprehensive movie dataset"""
    
    def __init__(self):
        self.movies = []
        self.genre_patterns = self._initialize_genre_patterns()
    
    def _initialize_genre_patterns(self) -> Dict:
        """Define successful genre combination patterns"""
        return {
            # High-performing combinations in India
            ("Action", "Drama"): {"india_score": 85, "global_score": 75, "ott_score": 80},
            ("Action", "Thriller"): {"india_score": 88, "global_score": 82, "ott_score": 85},
            ("Drama", "Romance"): {"india_score": 82, "global_score": 70, "ott_score": 78},
            ("Comedy", "Drama"): {"india_score": 80, "global_score": 72, "ott_score": 82},
            ("Horror", "Thriller"): {"india_score": 75, "global_score": 78, "ott_score": 80},
            ("Action", "Comedy"): {"india_score": 78, "global_score": 76, "ott_score": 75},
            ("Drama", "Social"): {"india_score": 85, "global_score": 68, "ott_score": 82},
            ("Sci-Fi", "Action"): {"india_score": 70, "global_score": 85, "ott_score": 88},
            ("Crime", "Thriller"): {"india_score": 82, "global_score": 80, "ott_score": 86},
            ("Romance", "Comedy"): {"india_score": 75, "global_score": 68, "ott_score": 72},
            ("Historical", "Drama"): {"india_score": 80, "global_score": 75, "ott_score": 78},
            ("Family", "Comedy"): {"india_score": 78, "global_score": 70, "ott_score": 80},
            ("Musical", "Drama"): {"india_score": 72, "global_score": 60, "ott_score": 68},
            ("Biographical", "Drama"): {"india_score": 82, "global_score": 78, "ott_score": 80},
            ("Fantasy", "Action"): {"india_score": 68, "global_score": 82, "ott_score": 85},
        }
    
    def generate_movie_dataset(self, count: int = 500) -> List[Dict]:
        """Generate comprehensive movie dataset"""
        movies = []
        
        # Indian blockbusters
        indian_movies = [
            {"title": "RRR", "genres": ["Action", "Drama", "Historical"], "language": "Telugu", 
             "box_office": 1200, "ott_views": 95, "region": "Pan-India", "year": 2022},
            {"title": "Pathaan", "genres": ["Action", "Thriller"], "language": "Hindi", 
             "box_office": 1050, "ott_views": 88, "region": "Pan-India", "year": 2023},
            {"title": "Jawan", "genres": ["Action", "Thriller", "Drama"], "language": "Hindi", 
             "box_office": 1150, "ott_views": 92, "region": "Pan-India", "year": 2023},
            {"title": "Baahubali 2", "genres": ["Action", "Drama", "Fantasy"], "language": "Telugu", 
             "box_office": 1810, "ott_views": 98, "region": "Pan-India", "year": 2017},
            {"title": "KGF Chapter 2", "genres": ["Action", "Crime", "Drama"], "language": "Kannada", 
             "box_office": 1250, "ott_views": 90, "region": "Pan-India", "year": 2022},
            {"title": "Dangal", "genres": ["Biographical", "Drama", "Social"], "language": "Hindi", 
             "box_office": 2100, "ott_views": 85, "region": "Pan-India", "year": 2016},
            {"title": "3 Idiots", "genres": ["Comedy", "Drama"], "language": "Hindi", 
             "box_office": 460, "ott_views": 92, "region": "Pan-India", "year": 2009},
            {"title": "Pushpa", "genres": ["Action", "Crime", "Thriller"], "language": "Telugu", 
             "box_office": 365, "ott_views": 88, "region": "Pan-India", "year": 2021},
            {"title": "Vikram", "genres": ["Action", "Thriller"], "language": "Tamil", 
             "box_office": 435, "ott_views": 82, "region": "South India", "year": 2022},
            {"title": "The Kashmir Files", "genres": ["Drama", "Historical"], "language": "Hindi", 
             "box_office": 340, "ott_views": 78, "region": "North India", "year": 2022},
            {"title": "Drishyam 2", "genres": ["Thriller", "Crime", "Drama"], "language": "Hindi", 
             "box_office": 240, "ott_views": 85, "region": "Pan-India", "year": 2022},
            {"title": "Kantara", "genres": ["Action", "Thriller", "Drama"], "language": "Kannada", 
             "box_office": 400, "ott_views": 88, "region": "Pan-India", "year": 2022},
            {"title": "Tumbbad", "genres": ["Horror", "Fantasy", "Thriller"], "language": "Hindi", 
             "box_office": 18, "ott_views": 95, "region": "Pan-India", "year": 2018},
            {"title": "Article 15", "genres": ["Crime", "Drama", "Social"], "language": "Hindi", 
             "box_office": 65, "ott_views": 88, "region": "North India", "year": 2019},
            {"title": "96", "genres": ["Romance", "Drama"], "language": "Tamil", 
             "box_office": 45, "ott_views": 90, "region": "South India", "year": 2018},
        ]
        
        # Global hits
        global_movies = [
            {"title": "Avatar 2", "genres": ["Sci-Fi", "Action", "Fantasy"], "language": "English", 
             "box_office": 2320, "ott_views": 92, "region": "Global", "year": 2022},
            {"title": "Top Gun Maverick", "genres": ["Action", "Drama"], "language": "English", 
             "box_office": 1490, "ott_views": 88, "region": "Global", "year": 2022},
            {"title": "Everything Everywhere", "genres": ["Sci-Fi", "Comedy", "Drama"], "language": "English", 
             "box_office": 140, "ott_views": 95, "region": "Global", "year": 2022},
            {"title": "The Batman", "genres": ["Action", "Crime", "Thriller"], "language": "English", 
             "box_office": 771, "ott_views": 85, "region": "Global", "year": 2022},
            {"title": "Oppenheimer", "genres": ["Biographical", "Drama", "Historical"], "language": "English", 
             "box_office": 952, "ott_views": 82, "region": "Global", "year": 2023},
        ]
        
        # Add base movies
        for movie in indian_movies + global_movies:
            movies.append(self._create_movie_entry(movie))
        
        # Add regional cinema expansion
        from regional_dataset import REGIONAL_MOVIES
        for movie in REGIONAL_MOVIES:
            movies.append(self._create_movie_entry(movie))
        
        # Generate synthetic movies to reach target count
        remaining = max(0, count - len(movies))
        for i in range(remaining):
            movies.append(self._generate_synthetic_movie(i))
        
        self.movies = movies
        return movies
    
    def _create_movie_entry(self, movie_data: Dict) -> Dict:
        """Create a complete movie entry with all attributes"""
        genres = movie_data["genres"]
        box_office = movie_data["box_office"]
        ott_views = movie_data["ott_views"]
        
        # Calculate success scores
        box_office_score = min(100, (box_office / 20) + 50)  # Normalize to 0-100
        ott_score = ott_views
        combined_score = (box_office_score * 0.5 + ott_score * 0.5)
        
        # Determine budget tier
        if box_office > 500:
            budget_tier = "High (100Cr+)"
        elif box_office > 200:
            budget_tier = "Medium (30-100Cr)"
        else:
            budget_tier = "Low (<30Cr)"
        
        return {
            "id": str(uuid.uuid4()),
            "title": movie_data["title"],
            "genres": genres,
            "primary_genre": genres[0],
            "language": movie_data["language"],
            "region": movie_data["region"],
            "year": movie_data["year"],
            "budget_tier": budget_tier,
            "box_office_cr": box_office,
            "ott_viewership_score": ott_views,
            "box_office_score": round(box_office_score, 1),
            "ott_score": ott_score,
            "combined_score": round(combined_score, 1),
            "tone": random.choice(["Dramatic", "Action-Packed", "Emotional"]),
            "release_type": "Theatrical" if box_office > 100 else random.choice(["Theatrical", "OTT", "Hybrid"]),
            "target_audience": self._determine_audience(genres, movie_data["region"]),
            "star_power": random.randint(6, 10) if box_office > 200 else random.randint(4, 8),
            "novelty_factor": random.randint(5, 10),
        }
    
    def _generate_synthetic_movie(self, index: int) -> Dict:
        """Generate a synthetic movie with realistic attributes"""
        # Select random genres (1-3)
        num_genres = random.randint(1, 3)
        genres = random.sample(GENRES, num_genres)
        
        language = random.choice(LANGUAGES)
        region = self._get_region_from_language(language)
        year = random.randint(2015, 2024)
        
        # Generate performance based on genre patterns
        base_score = self._calculate_base_score(genres)
        box_office = random.randint(10, 800) * (base_score / 80)
        ott_views = random.randint(50, 98)
        
        box_office_score = min(100, (box_office / 20) + 50)
        combined_score = (box_office_score * 0.5 + ott_views * 0.5)
        
        if box_office > 500:
            budget_tier = "High (100Cr+)"
        elif box_office > 200:
            budget_tier = "Medium (30-100Cr)"
        else:
            budget_tier = "Low (<30Cr)"
        
        return {
            "id": str(uuid.uuid4()),
            "title": f"Movie_{index + 1}",
            "genres": genres,
            "primary_genre": genres[0],
            "language": language,
            "region": region,
            "year": year,
            "budget_tier": budget_tier,
            "box_office_cr": round(box_office, 1),
            "ott_viewership_score": ott_views,
            "box_office_score": round(box_office_score, 1),
            "ott_score": ott_views,
            "combined_score": round(combined_score, 1),
            "tone": random.choice(TONES),
            "release_type": random.choice(RELEASE_TYPES),
            "target_audience": self._determine_audience(genres, region),
            "star_power": random.randint(3, 10),
            "novelty_factor": random.randint(3, 10),
        }
    
    def _calculate_base_score(self, genres: List[str]) -> float:
        """Calculate base success score from genres"""
        if len(genres) >= 2:
            pattern_key = tuple(sorted(genres[:2]))
            if pattern_key in self.genre_patterns:
                return self.genre_patterns[pattern_key]["india_score"]
        return random.randint(60, 85)
    
    def _get_region_from_language(self, language: str) -> str:
        """Determine region from language"""
        south_languages = ["Tamil", "Telugu", "Malayalam", "Kannada"]
        if language in south_languages:
            return random.choice(["South India", "Pan-India"])
        elif language == "English":
            return "Global"
        else:
            return random.choice(["North India", "Pan-India"])
    
    def _determine_audience(self, genres: List[str], region: str) -> List[str]:
        """Determine target audience segments"""
        audiences = []
        
        if "Action" in genres or "Thriller" in genres:
            audiences.extend(["Youth (18-35)", "Metros"])
        if "Drama" in genres or "Social" in genres:
            audiences.extend(["Families", "Tier-2 Cities"])
        if "Comedy" in genres or "Romance" in genres:
            audiences.extend(["Youth (18-35)", "Streaming-First"])
        if "Family" in genres:
            audiences.append("Families")
        
        if region in ["South India", "Pan-India"]:
            audiences.append("Regional")
        
        return list(set(audiences))[:3]  # Return up to 3 unique segments

# Initialize global dataset
MOVIE_DB = MovieDataset()
MOVIE_DATA = MOVIE_DB.generate_movie_dataset(700)