"""TMDB API Integration for real movie data"""
import os
import httpx
import time
import json
from typing import Optional, Dict, List
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TMDB_API_KEY", "")
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p/"

# Cache
cache = {}
CACHE_TTL = 3600  # 1 hour

class TMDBClient:
    """TMDB API Client with caching"""
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=10)
        self.api_key = API_KEY
    
    async def _request(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Dict]:
        """Make API request with caching"""
        if not self.api_key:
            return None
        
        params = params or {}
        cache_key = f"{endpoint}_{json.dumps(params, sort_keys=True)}"
        
        # Check cache
        if cache_key in cache:
            cached_data, timestamp = cache[cache_key]
            if time.time() - timestamp < CACHE_TTL:
                return cached_data
        
        # Make request
        params["api_key"] = self.api_key
        url = f"{BASE_URL}{endpoint}"
        
        try:
            response = await self.client.get(url, params=params)
            
            # Handle rate limiting
            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 2))
                await asyncio.sleep(retry_after)
                response = await self.client.get(url, params=params)
            
            response.raise_for_status()
            data = response.json()
            
            # Cache result
            cache[cache_key] = (data, time.time())
            return data
        except Exception as e:
            print(f"TMDB API error: {str(e)}")
            return None
    
    async def search_movies(self, query: str, year: Optional[int] = None) -> Optional[Dict]:
        """Search for movies"""
        params = {"query": query, "page": 1}
        if year:
            params["year"] = year
        return await self._request("/search/movie", params)
    
    async def get_movie_details(self, movie_id: int) -> Optional[Dict]:
        """Get detailed movie information"""
        return await self._request(
            f"/movie/{movie_id}",
            {"append_to_response": "credits,videos,keywords,reviews,similar"}
        )
    
    async def get_trending(self, time_window: str = "week") -> Optional[Dict]:
        """Get trending movies"""
        return await self._request(f"/trending/movie/{time_window}")
    
    async def get_popular(self) -> Optional[Dict]:
        """Get popular movies"""
        return await self._request("/movie/popular")
    
    async def get_top_rated(self) -> Optional[Dict]:
        """Get top rated movies"""
        return await self._request("/movie/top_rated")
    
    async def discover_movies(self, filters: Dict) -> Optional[Dict]:
        """Discover movies with filters"""
        return await self._request("/discover/movie", filters)
    
    async def get_genres(self) -> Optional[Dict]:
        """Get genre list"""
        return await self._request("/genre/movie/list")
    
    @staticmethod
    def get_image_url(path: Optional[str], size: str = "w500") -> Optional[str]:
        """Get full image URL"""
        return f"{IMAGE_BASE}{size}{path}" if path else None
    
    @staticmethod
    def get_year(movie: Dict) -> Optional[int]:
        """Extract year from movie"""
        date = movie.get("release_date", "")
        return int(date[:4]) if date and len(date) >= 4 else None
    
    @staticmethod
    def get_trailer_url(videos: Dict) -> Optional[str]:
        """Get YouTube trailer URL"""
        results = videos.get("results", [])
        for video in results:
            if video.get("type") == "Trailer" and video.get("site") == "YouTube":
                return f"https://www.youtube.com/watch?v={video['key']}"
        return None
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()

# Global client instance
tmdb_client = TMDBClient()