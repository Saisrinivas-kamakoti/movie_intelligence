from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

# Import ML engine and dataset
from movie_dataset import MOVIE_DATA, MOVIE_DB
from ml_engine import CineSignalMLEngine

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize ML Engine
ml_engine = CineSignalMLEngine(MOVIE_DATA)

# Create the main app without a prefix
app = FastAPI(title="CineSignal API", description="Film Demand Intelligence Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============= MODELS =============

class ConceptSimulation(BaseModel):
    """Film concept for simulation"""
    genres: List[str] = Field(..., description="List of genres (1-3)")
    tone: str = Field(..., description="Tone of the film")
    budget_tier: str = Field(..., description="Budget category")
    release_type: str = Field(..., description="Release strategy")
    language: str = Field(..., description="Primary language")
    star_power: int = Field(..., ge=1, le=10, description="Star power rating 1-10")
    novelty_factor: int = Field(..., ge=1, le=10, description="Novelty rating 1-10")
    family_appeal: int = Field(..., ge=1, le=10, description="Family appeal rating 1-10")

class PredictionResponse(BaseModel):
    """Prediction result"""
    overall_score: float
    label: str
    confidence: str
    market_scores: Dict
    component_scores: Dict
    recommendations: List[str]
    similar_successful_movies: List[Dict]
    target_audience: List[str]
    risk_factors: List[str]

class MovieFilter(BaseModel):
    """Filters for movie data"""
    genres: Optional[List[str]] = None
    language: Optional[str] = None
    region: Optional[str] = None
    min_score: Optional[float] = None
    year: Optional[int] = None

class MovieStats(BaseModel):
    """Movie statistics"""
    total_movies: int
    avg_score: float
    genre_distribution: Dict
    language_distribution: Dict
    region_distribution: Dict


# ============= ROUTES =============

@api_router.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "CineSignal API - Film Demand Intelligence Platform",
        "version": "1.0.0",
        "status": "active",
        "total_movies": len(MOVIE_DATA)
    }

@api_router.post("/simulate", response_model=PredictionResponse)
async def simulate_concept(concept: ConceptSimulation):
    """
    Simulate a film concept and get AI predictions
    
    Returns success scores, market fit, recommendations, and similar successful movies
    """
    try:
        # Convert to dict for ML engine
        concept_dict = concept.model_dump()
        
        # Get prediction from ML engine
        prediction = ml_engine.predict_success(concept_dict)
        
        # Store simulation in database
        simulation_record = {
            "id": str(uuid.uuid4()),
            "concept": concept_dict,
            "prediction": prediction,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.simulations.insert_one(simulation_record)
        
        return prediction
    except Exception as e:
        logging.error(f"Simulation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@api_router.get("/movies")
async def get_movies(
    genre: Optional[str] = None,
    language: Optional[str] = None,
    region: Optional[str] = None,
    min_score: Optional[float] = None,
    limit: int = 50
):
    """
    Get movie data with optional filters
    
    Supports filtering by genre, language, region, and minimum score
    """
    try:
        filtered_movies = MOVIE_DATA.copy()
        
        # Apply filters
        if genre:
            filtered_movies = [m for m in filtered_movies if genre in m["genres"]]
        if language:
            filtered_movies = [m for m in filtered_movies if m["language"] == language]
        if region:
            filtered_movies = [m for m in filtered_movies if m["region"] == region]
        if min_score:
            filtered_movies = [m for m in filtered_movies if m["combined_score"] >= min_score]
        
        # Sort by combined score
        filtered_movies.sort(key=lambda x: x["combined_score"], reverse=True)
        
        return {
            "total": len(filtered_movies),
            "movies": filtered_movies[:limit]
        }
    except Exception as e:
        logging.error(f"Get movies error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch movies: {str(e)}")

@api_router.get("/movies/top")
async def get_top_movies(limit: int = 20, metric: str = "combined"):
    """
    Get top performing movies
    
    metric options: combined, box_office, ott
    """
    try:
        movies = MOVIE_DATA.copy()
        
        # Sort by metric
        if metric == "box_office":
            movies.sort(key=lambda x: x["box_office_score"], reverse=True)
        elif metric == "ott":
            movies.sort(key=lambda x: x["ott_score"], reverse=True)
        else:
            movies.sort(key=lambda x: x["combined_score"], reverse=True)
        
        return {
            "metric": metric,
            "top_movies": movies[:limit]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch top movies: {str(e)}")

@api_router.get("/analytics/genre-performance")
async def get_genre_performance():
    """
    Get genre performance analytics
    
    Returns average scores for each genre across box office, OTT, and combined metrics
    """
    try:
        genre_data = ml_engine.get_genre_performance_data()
        
        # Format for frontend charts
        formatted_data = []
        for genre, stats in genre_data.items():
            formatted_data.append({
                "genre": genre,
                "box_office": stats["avg_box_office"],
                "ott": stats["avg_ott"],
                "combined": stats["avg_combined"],
                "count": stats["count"]
            })
        
        # Sort by combined score
        formatted_data.sort(key=lambda x: x["combined"], reverse=True)
        
        return {
            "data": formatted_data,
            "total_genres": len(formatted_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Genre performance analysis failed: {str(e)}")

@api_router.get("/analytics/trends")
async def get_trends(years: int = 5):
    """
    Get trend data over years
    
    Shows how movie performance has evolved over time
    """
    try:
        trend_data = ml_engine.get_trend_data(years)
        return {
            "years": years,
            "data": trend_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

@api_router.get("/analytics/regional")
async def get_regional_analysis():
    """
    Get regional performance analysis
    
    Compares performance across North India, South India, Pan-India, and Global markets
    """
    try:
        regional_data = ml_engine.regional_trends
        
        # Format for frontend
        formatted_regions = []
        for region, genres in regional_data.items():
            if genres:  # Only include regions with data
                formatted_regions.append({
                    "region": region,
                    "genres": genres,
                    "avg_score": round(sum(genres.values()) / len(genres), 1) if genres else 0
                })
        
        return {
            "data": formatted_regions,
            "total_regions": len(formatted_regions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regional analysis failed: {str(e)}")

@api_router.get("/analytics/audience")
async def get_audience_insights():
    """
    Get audience segment preferences
    
    Returns preferred genres for different audience segments
    """
    try:
        audience_data = ml_engine.audience_preferences
        
        return {
            "segments": audience_data,
            "total_segments": len(audience_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audience insights failed: {str(e)}")

@api_router.get("/analytics/genre-combinations")
async def get_genre_combinations(min_count: int = 3):
    """
    Get successful genre combination patterns
    
    Returns genre pairs that have historically performed well
    """
    try:
        patterns = ml_engine.genre_patterns
        
        # Format patterns
        formatted_patterns = []
        for pattern, data in patterns.items():
            if data["count"] >= min_count:
                formatted_patterns.append({
                    "genres": list(pattern),
                    "avg_score": round(data["avg_score"], 1),
                    "count": data["count"]
                })
        
        # Sort by average score
        formatted_patterns.sort(key=lambda x: x["avg_score"], reverse=True)
        
        return {
            "patterns": formatted_patterns[:20],  # Top 20 patterns
            "total_patterns": len(formatted_patterns)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Genre combination analysis failed: {str(e)}")

@api_router.get("/stats")
async def get_statistics():
    """
    Get overall platform statistics
    
    Returns aggregated stats about the movie database
    """
    try:
        # Calculate distributions
        genre_dist = {}
        language_dist = {}
        region_dist = {}
        
        for movie in MOVIE_DATA:
            # Genres
            for genre in movie["genres"]:
                genre_dist[genre] = genre_dist.get(genre, 0) + 1
            
            # Languages
            lang = movie["language"]
            language_dist[lang] = language_dist.get(lang, 0) + 1
            
            # Regions
            reg = movie["region"]
            region_dist[reg] = region_dist.get(reg, 0) + 1
        
        # Calculate average score
        avg_score = sum(m["combined_score"] for m in MOVIE_DATA) / len(MOVIE_DATA)
        
        return {
            "total_movies": len(MOVIE_DATA),
            "avg_score": round(avg_score, 1),
            "genre_distribution": genre_dist,
            "language_distribution": language_dist,
            "region_distribution": region_dist,
            "years_covered": list(set(m["year"] for m in MOVIE_DATA))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Statistics calculation failed: {str(e)}")

@api_router.get("/metadata")
async def get_metadata():
    """
    Get platform metadata
    
    Returns available options for genres, tones, languages, etc.
    """
    return {
        "genres": [
            "Action", "Drama", "Comedy", "Thriller", "Romance", 
            "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
            "Family", "Musical", "Historical", "Biographical", "Social"
        ],
        "tones": ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"],
        "budget_tiers": ["Low (<30Cr)", "Medium (30-100Cr)", "High (100Cr+)"],
        "release_types": ["Theatrical", "OTT", "Hybrid"],
        "languages": ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi"],
        "regions": ["North India", "South India", "Pan-India", "Global"]
    }

@api_router.get("/simulations/history")
async def get_simulation_history(limit: int = 50):
    """
    Get historical simulations
    
    Returns past simulations stored in the database
    """
    try:
        simulations = await db.simulations.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return {
            "total": len(simulations),
            "simulations": simulations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch simulation history: {str(e)}")


# Include the router in the main app
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("CineSignal API starting up...")
    logger.info(f"Loaded {len(MOVIE_DATA)} movies into database")
    logger.info("ML Engine initialized successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")
