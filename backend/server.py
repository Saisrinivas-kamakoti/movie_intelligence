from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

# Import modules
from movie_dataset import MOVIE_DATA, MOVIE_DB
from ml_engine import CineSignalMLEngine
from neural_network_model import advanced_predictor
from tmdb_integration import tmdb_client
from studio_presentation import presentation_generator
from feedback_system import FeedbackSystem, Feedback
from director_testing import DIRECTOR_PRESETS, CASE_STUDIES, calculate_roi
from auth import auth_router, init_auth
from workspace import workspace_router, init_workspace
from director_advisor import DirectorIdeaAdvisor
from memory_store import MemoryClient, MemoryDatabase

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("DB_NAME", "cinesignal")

if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    database_mode = "mongodb"
else:
    client = MemoryClient()
    db = MemoryDatabase()
    database_mode = "memory"

# Initialize systems
ml_engine = CineSignalMLEngine(MOVIE_DATA)
feedback_system = FeedbackSystem(db)
director_idea_advisor = DirectorIdeaAdvisor(ml_engine)
init_auth(db)
init_workspace(db)

app = FastAPI(title="CineSignal API", description="Film Demand Intelligence Platform - Advanced")
api_router = APIRouter(prefix="/api")


# ============= MODELS =============

class ConceptSimulation(BaseModel):
    genres: List[str] = Field(..., description="List of genres (1-3)")
    tone: str = Field(..., description="Tone of the film")
    budget_tier: str = Field(..., description="Budget category")
    release_type: str = Field(..., description="Release strategy")
    language: str = Field(..., description="Primary language")
    star_power: int = Field(..., ge=1, le=10)
    novelty_factor: int = Field(..., ge=1, le=10)
    family_appeal: int = Field(..., ge=1, le=10)

class FeedbackInput(BaseModel):
    concept: Dict
    prediction: Dict
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None
    user_email: Optional[str] = None

class ComparisonInput(BaseModel):
    concepts: List[ConceptSimulation]

class DirectorIdeaInput(BaseModel):
    mode: str = Field(default="analyze", description="analyze or generate")
    concept_text: Optional[str] = Field(default="", max_length=2000)
    target_genre: Optional[str] = None
    preferred_language: str = Field(default="Hindi")
    release_type: str = Field(default="Theatrical")
    budget_tier: str = Field(default="Medium (30-100Cr)")
    star_power: int = Field(default=5, ge=1, le=10)


# ============= CORE ROUTES =============

@api_router.get("/")
async def root():
    return {
        "message": "CineSignal API - Film Demand Intelligence Platform",
        "version": "2.0.0",
        "status": "active",
        "total_movies": len(MOVIE_DATA),
        "features": ["simulator", "analytics", "neural_network", "tmdb", "pdf_export", "feedback", "director_presets", "roi_calculator", "idea_lab"],
        "database_mode": database_mode,
    }

@api_router.post("/simulate")
async def simulate_concept(concept: ConceptSimulation):
    try:
        concept_dict = concept.model_dump()
        
        # Heuristic prediction
        heuristic_prediction = ml_engine.predict_success(concept_dict)
        
        # Neural network prediction
        nn_prediction = advanced_predictor.predict(concept_dict)
        
        # ROI calculation
        roi_estimate = calculate_roi(concept_dict, heuristic_prediction)
        
        # Combine results
        combined = {
            **heuristic_prediction,
            "neural_network": nn_prediction,
            "roi_estimate": roi_estimate
        }
        
        # Store simulation
        simulation_record = {
            "id": str(uuid.uuid4()),
            "concept": concept_dict,
            "prediction": combined,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.simulations.insert_one(simulation_record)
        
        return combined
    except Exception as e:
        logging.error(f"Simulation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


# ============= MOVIE ROUTES =============

@api_router.get("/movies")
async def get_movies(genre: Optional[str] = None, language: Optional[str] = None, region: Optional[str] = None, min_score: Optional[float] = None, limit: int = 50):
    try:
        filtered = MOVIE_DATA.copy()
        if genre:
            filtered = [m for m in filtered if genre in m["genres"]]
        if language:
            filtered = [m for m in filtered if m["language"] == language]
        if region:
            filtered = [m for m in filtered if m["region"] == region]
        if min_score:
            filtered = [m for m in filtered if m["combined_score"] >= min_score]
        filtered.sort(key=lambda x: x["combined_score"], reverse=True)
        return {"total": len(filtered), "movies": filtered[:limit]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/movies/top")
async def get_top_movies(limit: int = 20, metric: str = "combined"):
    try:
        movies = MOVIE_DATA.copy()
        sort_key = {"box_office": "box_office_score", "ott": "ott_score"}.get(metric, "combined_score")
        movies.sort(key=lambda x: x[sort_key], reverse=True)
        return {"metric": metric, "top_movies": movies[:limit]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= ANALYTICS ROUTES =============

@api_router.get("/analytics/genre-performance")
async def get_genre_performance():
    try:
        genre_data = ml_engine.get_genre_performance_data()
        formatted = [{"genre": g, "box_office": s["avg_box_office"], "ott": s["avg_ott"], "combined": s["avg_combined"], "count": s["count"]} for g, s in genre_data.items()]
        formatted.sort(key=lambda x: x["combined"], reverse=True)
        return {"data": formatted, "total_genres": len(formatted)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/trends")
async def get_trends(years: int = 5):
    try:
        return {"years": years, "data": ml_engine.get_trend_data(years)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/regional")
async def get_regional_analysis():
    try:
        regional_data = ml_engine.regional_trends
        formatted = []
        for region, genres in regional_data.items():
            if genres:
                formatted.append({"region": region, "genres": genres, "avg_score": round(sum(genres.values()) / len(genres), 1)})
        return {"data": formatted, "total_regions": len(formatted)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/audience")
async def get_audience_insights():
    try:
        return {"segments": ml_engine.audience_preferences, "total_segments": len(ml_engine.audience_preferences)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/genre-combinations")
async def get_genre_combinations(min_count: int = 3):
    try:
        patterns = ml_engine.genre_patterns
        formatted = [{"genres": list(p), "avg_score": round(d["avg_score"], 1), "count": d["count"]} for p, d in patterns.items() if d["count"] >= min_count]
        formatted.sort(key=lambda x: x["avg_score"], reverse=True)
        return {"patterns": formatted[:20], "total_patterns": len(formatted)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= TMDB ROUTES =============

@api_router.get("/tmdb/search")
async def tmdb_search(query: str):
    try:
        result = await tmdb_client.search_movies(query)
        if not result:
            return {"results": [], "message": "TMDB API key not configured or search failed"}
        movies = []
        for m in result.get("results", [])[:10]:
            movies.append({
                "id": m.get("id"),
                "title": m.get("title"),
                "overview": m.get("overview", "")[:200],
                "release_date": m.get("release_date"),
                "vote_average": m.get("vote_average"),
                "poster": tmdb_client.get_image_url(m.get("poster_path"), "w342"),
                "popularity": m.get("popularity")
            })
        return {"results": movies, "total": result.get("total_results", 0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/tmdb/trending")
async def tmdb_trending():
    try:
        result = await tmdb_client.get_trending()
        if not result:
            return {"results": [], "message": "TMDB API key not configured"}
        movies = []
        for m in result.get("results", [])[:10]:
            movies.append({
                "id": m.get("id"),
                "title": m.get("title", m.get("name")),
                "overview": m.get("overview", "")[:200],
                "release_date": m.get("release_date", m.get("first_air_date")),
                "vote_average": m.get("vote_average"),
                "poster": tmdb_client.get_image_url(m.get("poster_path"), "w342"),
                "popularity": m.get("popularity")
            })
        return {"results": movies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/tmdb/movie/{movie_id}")
async def tmdb_movie_details(movie_id: int):
    try:
        result = await tmdb_client.get_movie_details(movie_id)
        if not result:
            return {"error": "Movie not found or TMDB not configured"}
        
        cast = [{"name": c["name"], "character": c.get("character", ""), "profile": tmdb_client.get_image_url(c.get("profile_path"), "w185")} for c in result.get("credits", {}).get("cast", [])[:10]]
        crew = [{"name": c["name"], "job": c.get("job", "")} for c in result.get("credits", {}).get("crew", []) if c.get("job") in ["Director", "Producer", "Writer"]]
        
        return {
            "id": result.get("id"),
            "title": result.get("title"),
            "overview": result.get("overview"),
            "genres": [g["name"] for g in result.get("genres", [])],
            "release_date": result.get("release_date"),
            "runtime": result.get("runtime"),
            "vote_average": result.get("vote_average"),
            "vote_count": result.get("vote_count"),
            "budget": result.get("budget"),
            "revenue": result.get("revenue"),
            "poster": tmdb_client.get_image_url(result.get("poster_path")),
            "backdrop": tmdb_client.get_image_url(result.get("backdrop_path"), "w1280"),
            "cast": cast,
            "crew": crew,
            "trailer": tmdb_client.get_trailer_url(result.get("videos", {})),
            "status": result.get("status")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= STUDIO PRESENTATION ROUTES =============

@api_router.post("/export/pitch-deck")
async def export_pitch_deck(concept: ConceptSimulation):
    try:
        concept_dict = concept.model_dump()
        prediction = ml_engine.predict_success(concept_dict)
        nn_pred = advanced_predictor.predict(concept_dict)
        roi = calculate_roi(concept_dict, prediction)
        prediction["neural_network"] = nn_pred
        prediction["roi_estimate"] = roi
        
        pdf_buffer = presentation_generator.generate_pitch_deck(concept_dict, prediction)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=CineSignal_PitchDeck.pdf"}
        )
    except Exception as e:
        logging.error(f"PDF export error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/compare")
async def compare_concepts(data: ComparisonInput):
    try:
        results = []
        for concept in data.concepts:
            concept_dict = concept.model_dump()
            prediction = ml_engine.predict_success(concept_dict)
            nn_pred = advanced_predictor.predict(concept_dict)
            roi = calculate_roi(concept_dict, prediction)
            results.append({
                "concept": concept_dict,
                "prediction": {**prediction, "neural_network": nn_pred, "roi_estimate": roi}
            })
        
        # Rank concepts
        results.sort(key=lambda x: x["prediction"]["overall_score"], reverse=True)
        for i, r in enumerate(results):
            r["rank"] = i + 1
        
        return {"comparisons": results, "total": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= FEEDBACK ROUTES =============

@api_router.post("/feedback")
async def submit_feedback(feedback_input: FeedbackInput):
    try:
        feedback = Feedback(
            concept=feedback_input.concept,
            prediction=feedback_input.prediction,
            rating=feedback_input.rating,
            comments=feedback_input.comments,
            user_email=feedback_input.user_email
        )
        feedback_id = await feedback_system.submit_feedback(feedback)
        return {"message": "Feedback submitted successfully", "feedback_id": feedback_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/feedback/stats")
async def get_feedback_stats():
    try:
        return await feedback_system.get_feedback_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/feedback/insights")
async def get_feedback_insights():
    try:
        return {"insights": await feedback_system.get_improvement_insights()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= DIRECTOR TESTING ROUTES =============

@api_router.get("/directors/presets")
async def get_director_presets():
    return {"presets": DIRECTOR_PRESETS, "total": len(DIRECTOR_PRESETS)}

@api_router.get("/directors/preset/{preset_id}")
async def get_director_preset(preset_id: str):
    preset = next((p for p in DIRECTOR_PRESETS if p["id"] == preset_id), None)
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    return preset

@api_router.post("/directors/test/{preset_id}")
async def test_director_preset(preset_id: str):
    try:
        preset = next((p for p in DIRECTOR_PRESETS if p["id"] == preset_id), None)
        if not preset:
            raise HTTPException(status_code=404, detail="Preset not found")
        
        concept = preset["concept"]
        prediction = ml_engine.predict_success(concept)
        nn_pred = advanced_predictor.predict(concept)
        roi = calculate_roi(concept, prediction)
        
        return {
            "director": preset["director"],
            "style": preset["style"],
            "concept": concept,
            "prediction": {**prediction, "neural_network": nn_pred, "roi_estimate": roi},
            "reference_movies": preset["reference_movies"],
            "description": preset["description"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/case-studies")
async def get_case_studies():
    return {"case_studies": CASE_STUDIES, "total": len(CASE_STUDIES)}

@api_router.get("/case-studies/{index}")
async def get_case_study(index: int):
    if 0 <= index < len(CASE_STUDIES):
        return CASE_STUDIES[index]
    raise HTTPException(status_code=404, detail="Case study not found")

@api_router.post("/directors/idea-lab")
async def analyze_director_idea(payload: DirectorIdeaInput):
    try:
        if payload.mode == "analyze" and len(payload.concept_text.strip()) < 40:
            raise HTTPException(status_code=400, detail="Please describe the concept in at least 40 characters for analysis.")

        result = director_idea_advisor.analyze(payload.model_dump())
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= METADATA & STATS =============

@api_router.get("/stats")
async def get_statistics():
    try:
        genre_dist = {}
        language_dist = {}
        region_dist = {}
        
        for movie in MOVIE_DATA:
            for genre in movie["genres"]:
                genre_dist[genre] = genre_dist.get(genre, 0) + 1
            language_dist[movie["language"]] = language_dist.get(movie["language"], 0) + 1
            region_dist[movie["region"]] = region_dist.get(movie["region"], 0) + 1
        
        avg_score = sum(m["combined_score"] for m in MOVIE_DATA) / len(MOVIE_DATA)
        
        # Feedback stats
        fb_stats = await feedback_system.get_feedback_stats()
        
        return {
            "total_movies": len(MOVIE_DATA),
            "avg_score": round(avg_score, 1),
            "genre_distribution": genre_dist,
            "language_distribution": language_dist,
            "region_distribution": region_dist,
            "years_covered": sorted(list(set(m["year"] for m in MOVIE_DATA))),
            "feedback": fb_stats,
            "ml_models": ["Heuristic (v1)", "Neural Network (v1)", "Director Idea Advisor (v1)"],
            "features": ["simulator", "analytics", "neural_network", "tmdb", "pdf_export", "feedback", "director_presets", "roi_calculator", "case_studies", "comparison", "idea_lab"],
            "database_mode": database_mode,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/metadata")
async def get_metadata():
    return {
        "genres": ["Action", "Drama", "Comedy", "Thriller", "Romance", "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery", "Family", "Musical", "Historical", "Biographical", "Social"],
        "tones": ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"],
        "budget_tiers": ["Low (<30Cr)", "Medium (30-100Cr)", "High (100Cr+)"],
        "release_types": ["Theatrical", "OTT", "Hybrid"],
        "languages": ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi", "Punjabi", "Gujarati", "Assamese", "Odia"],
        "regions": ["North India", "South India", "Pan-India", "Global"],
        "director_lab_modes": ["analyze", "generate"],
    }

@api_router.get("/simulations/history")
async def get_simulation_history(limit: int = 50):
    try:
        simulations = await db.simulations.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return {"total": len(simulations), "simulations": simulations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= APP SETUP =============

app.include_router(api_router)
app.include_router(auth_router)
app.include_router(workspace_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("CineSignal API v2.0 starting up...")
    logger.info(f"Loaded {len(MOVIE_DATA)} movies, {len(DIRECTOR_PRESETS)} director presets, {len(CASE_STUDIES)} case studies")
    logger.info(f"ML Engine + Neural Network initialized | storage={database_mode}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    await tmdb_client.close()
    logger.info("Connections closed")
