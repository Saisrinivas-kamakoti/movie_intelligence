# 🔌 CineSignal API Documentation

## Base URL
```
Production: https://pensive-panini-2.preview.emergentagent.com/api
Local: http://localhost:8001/api
```

## Authentication
Currently, no authentication required (MVP version).

---

## Core Endpoints

### 1. Health Check
**GET** `/`

Returns platform status and basic info.

**Response:**
```json
{
  "message": "CineSignal API - Film Demand Intelligence Platform",
  "version": "1.0.0",
  "status": "active",
  "total_movies": 500
}
```

---

### 2. Simulate Film Concept
**POST** `/simulate`

Get AI-powered predictions for a film concept.

**Request Body:**
```json
{
  "genres": ["Action", "Drama"],
  "tone": "Dramatic",
  "budget_tier": "High (100Cr+)",
  "release_type": "Theatrical",
  "language": "Hindi",
  "star_power": 8,
  "novelty_factor": 7,
  "family_appeal": 6
}
```

**Response:**
```json
{
  "overall_score": 78.1,
  "label": "Strong Commercial Viability",
  "confidence": "High",
  "market_scores": {
    "india_fit": 95.0,
    "global_fit": 76.0,
    "theatrical_potential": 88.7,
    "ott_potential": 86.5
  },
  "component_scores": {
    "genre_resonance": 86.6,
    "tone_fit": 75.0,
    "budget_efficiency": 90.0,
    "release_strategy": 85.0,
    "star_appeal": 80.0,
    "novelty_factor": 70.0,
    "family_appeal": 60.0
  },
  "recommendations": [
    "✓ Focus on India-first release strategy - strong domestic appeal",
    "✓ Theatrical release recommended - high spectacle value"
  ],
  "similar_successful_movies": [
    {
      "title": "Top Gun Maverick",
      "genres": ["Action", "Drama"],
      "score": 94.0,
      "box_office": 1490,
      "similarity": 100.0
    }
  ],
  "target_audience": ["Youth (18-35)", "Metros", "Families"],
  "risk_factors": ["No major risk factors identified"]
}
```

---

### 3. Get Movies
**GET** `/movies`

Retrieve movie data with optional filters.

**Query Parameters:**
- `genre` (string): Filter by genre
- `language` (string): Filter by language
- `region` (string): Filter by region
- `min_score` (float): Minimum combined score
- `limit` (int): Number of results (default: 50)

**Example:**
```
GET /movies?genre=Action&language=Hindi&min_score=80&limit=20
```

**Response:**
```json
{
  "total": 45,
  "movies": [
    {
      "id": "uuid",
      "title": "Pathaan",
      "genres": ["Action", "Thriller"],
      "language": "Hindi",
      "region": "Pan-India",
      "year": 2023,
      "budget_tier": "High (100Cr+)",
      "box_office_cr": 1050,
      "box_office_score": 92.5,
      "ott_score": 88,
      "combined_score": 95.0,
      "tone": "Action-Packed",
      "release_type": "Theatrical"
    }
  ]
}
```

---

### 4. Get Top Movies
**GET** `/movies/top`

Get top performing movies by metric.

**Query Parameters:**
- `limit` (int): Number of results (default: 20)
- `metric` (string): Sorting metric - `combined`, `box_office`, or `ott`

**Example:**
```
GET /movies/top?limit=10&metric=combined
```

**Response:**
```json
{
  "metric": "combined",
  "top_movies": [
    {
      "title": "Baahubali 2",
      "combined_score": 99.0,
      "box_office_cr": 1810,
      "ott_score": 98
    }
  ]
}
```

---

## Analytics Endpoints

### 5. Genre Performance
**GET** `/analytics/genre-performance`

Get comprehensive genre performance analytics.

**Response:**
```json
{
  "data": [
    {
      "genre": "Action",
      "box_office": 79.5,
      "ott": 83.2,
      "combined": 81.4,
      "count": 87
    }
  ],
  "total_genres": 15
}
```

---

### 6. Trends Over Time
**GET** `/analytics/trends`

Get performance trends over years.

**Query Parameters:**
- `years` (int): Number of years to analyze (default: 5)

**Response:**
```json
{
  "years": 5,
  "data": [
    {
      "year": 2020,
      "avg_score": 72.4,
      "count": 45
    },
    {
      "year": 2021,
      "avg_score": 74.1,
      "count": 52
    }
  ]
}
```

---

### 7. Regional Analysis
**GET** `/analytics/regional`

Get regional market performance comparison.

**Response:**
```json
{
  "data": [
    {
      "region": "Pan-India",
      "genres": {
        "Action": 85.2,
        "Drama": 78.5,
        "Comedy": 72.3
      },
      "avg_score": 78.7
    },
    {
      "region": "South India",
      "genres": {
        "Action": 88.1,
        "Romance": 75.4
      },
      "avg_score": 81.8
    }
  ],
  "total_regions": 4
}
```

---

### 8. Audience Insights
**GET** `/analytics/audience`

Get audience segment preferences.

**Response:**
```json
{
  "segments": {
    "metros": ["Action", "Thriller", "Sci-Fi"],
    "tier2": ["Drama", "Social", "Family"],
    "youth": ["Action", "Romance", "Comedy"],
    "families": ["Drama", "Comedy", "Family"]
  },
  "total_segments": 4
}
```

---

### 9. Genre Combinations
**GET** `/analytics/genre-combinations`

Get successful genre combination patterns.

**Query Parameters:**
- `min_count` (int): Minimum number of movies (default: 3)

**Response:**
```json
{
  "patterns": [
    {
      "genres": ["Action", "Drama"],
      "avg_score": 86.6,
      "count": 45
    },
    {
      "genres": ["Action", "Thriller"],
      "avg_score": 88.0,
      "count": 38
    }
  ],
  "total_patterns": 52
}
```

---

## Metadata Endpoints

### 10. Platform Statistics
**GET** `/stats`

Get overall platform statistics.

**Response:**
```json
{
  "total_movies": 500,
  "avg_score": 71.9,
  "genre_distribution": {
    "Action": 87,
    "Drama": 125,
    "Comedy": 65
  },
  "language_distribution": {
    "Hindi": 180,
    "Tamil": 95,
    "Telugu": 88
  },
  "region_distribution": {
    "Pan-India": 145,
    "North India": 132,
    "South India": 178,
    "Global": 45
  },
  "years_covered": [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
}
```

---

### 11. Get Metadata
**GET** `/metadata`

Get available options for all fields.

**Response:**
```json
{
  "genres": [
    "Action", "Drama", "Comedy", "Thriller", "Romance",
    "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
    "Family", "Musical", "Historical", "Biographical", "Social"
  ],
  "tones": [
    "Dark", "Light", "Dramatic", "Action-Packed",
    "Emotional", "Suspenseful", "Humorous"
  ],
  "budget_tiers": [
    "Low (<30Cr)", "Medium (30-100Cr)", "High (100Cr+)"
  ],
  "release_types": ["Theatrical", "OTT", "Hybrid"],
  "languages": [
    "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada",
    "English", "Bengali", "Marathi"
  ],
  "regions": ["North India", "South India", "Pan-India", "Global"]
}
```

---

### 12. Simulation History
**GET** `/simulations/history`

Get past simulations (stored in database).

**Query Parameters:**
- `limit` (int): Number of results (default: 50)

**Response:**
```json
{
  "total": 25,
  "simulations": [
    {
      "id": "uuid",
      "concept": {
        "genres": ["Action", "Drama"],
        "tone": "Dramatic"
      },
      "prediction": {
        "overall_score": 78.1,
        "label": "Strong Commercial Viability"
      },
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "detail": "Please select at least one genre"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Simulation failed: [error details]"
}
```

---

## Rate Limits
Currently no rate limits (MVP version).

---

## Example cURL Commands

### Simulate a Concept
```bash
curl -X POST https://pensive-panini-2.preview.emergentagent.com/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "genres": ["Action", "Drama"],
    "tone": "Dramatic",
    "budget_tier": "High (100Cr+)",
    "release_type": "Theatrical",
    "language": "Hindi",
    "star_power": 8,
    "novelty_factor": 7,
    "family_appeal": 6
  }'
```

### Get Top Movies
```bash
curl https://pensive-panini-2.preview.emergentagent.com/api/movies/top?limit=10&metric=combined
```

### Get Genre Performance
```bash
curl https://pensive-panini-2.preview.emergentagent.com/api/analytics/genre-performance
```

---

## JavaScript Example

```javascript
const API_URL = 'https://pensive-panini-2.preview.emergentagent.com/api';

// Simulate film concept
async function simulateConcept() {
  const concept = {
    genres: ["Action", "Drama"],
    tone: "Dramatic",
    budget_tier: "High (100Cr+)",
    release_type: "Theatrical",
    language: "Hindi",
    star_power: 8,
    novelty_factor: 7,
    family_appeal: 6
  };

  const response = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(concept)
  });

  const prediction = await response.json();
  console.log('Success Score:', prediction.overall_score);
  console.log('Label:', prediction.label);
}

// Get genre performance
async function getGenrePerformance() {
  const response = await fetch(`${API_URL}/analytics/genre-performance`);
  const data = await response.json();
  console.log('Genre Data:', data);
}
```

---

## Python Example

```python
import requests

API_URL = 'https://pensive-panini-2.preview.emergentagent.com/api'

# Simulate film concept
def simulate_concept():
    concept = {
        "genres": ["Action", "Drama"],
        "tone": "Dramatic",
        "budget_tier": "High (100Cr+)",
        "release_type": "Theatrical",
        "language": "Hindi",
        "star_power": 8,
        "novelty_factor": 7,
        "family_appeal": 6
    }
    
    response = requests.post(f'{API_URL}/simulate', json=concept)
    prediction = response.json()
    
    print(f"Success Score: {prediction['overall_score']}")
    print(f"Label: {prediction['label']}")
    return prediction

# Get top movies
def get_top_movies():
    response = requests.get(f'{API_URL}/movies/top?limit=10&metric=combined')
    data = response.json()
    
    for movie in data['top_movies']:
        print(f"{movie['title']}: {movie['combined_score']}")
```

---

## Response Time
- Average: 200-500ms
- Simulation endpoint: 300-600ms (ML processing)
- Analytics endpoints: 100-300ms (cached data)

---

## Data Freshness
- Movie dataset: Static (500 movies)
- Analytics: Real-time computation
- Simulations: Stored in MongoDB

---

## Support
For API issues or questions, refer to the main README.md or contact support.

---

**Happy Building! 🚀**
