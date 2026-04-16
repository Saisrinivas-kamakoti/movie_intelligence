"""Director testing suite with pre-loaded real film concepts"""
from typing import Dict, List

# Famous director concept presets
DIRECTOR_PRESETS = [
    {
        "id": "rajamouli_epic",
        "director": "S.S. Rajamouli",
        "style": "Epic Visual Storytelling",
        "concept": {
            "genres": ["Action", "Drama", "Historical"],
            "tone": "Dramatic",
            "budget_tier": "High (100Cr+)",
            "release_type": "Theatrical",
            "language": "Telugu",
            "star_power": 9,
            "novelty_factor": 9,
            "family_appeal": 8
        },
        "reference_movies": ["Baahubali 2", "RRR"],
        "description": "Grand visual spectacles with deep emotional storytelling, pan-India appeal"
    },
    {
        "id": "nolan_cerebral",
        "director": "Christopher Nolan",
        "style": "Cerebral Spectacle",
        "concept": {
            "genres": ["Sci-Fi", "Thriller", "Drama"],
            "tone": "Dark",
            "budget_tier": "High (100Cr+)",
            "release_type": "Theatrical",
            "language": "English",
            "star_power": 9,
            "novelty_factor": 10,
            "family_appeal": 5
        },
        "reference_movies": ["Oppenheimer", "Interstellar", "Inception"],
        "description": "Mind-bending narratives with massive scale and practical effects"
    },
    {
        "id": "hirani_heartfelt",
        "director": "Rajkumar Hirani",
        "style": "Heartfelt Social Comedy",
        "concept": {
            "genres": ["Comedy", "Drama", "Social"],
            "tone": "Humorous",
            "budget_tier": "Medium (30-100Cr)",
            "release_type": "Theatrical",
            "language": "Hindi",
            "star_power": 8,
            "novelty_factor": 7,
            "family_appeal": 9
        },
        "reference_movies": ["3 Idiots", "PK", "Munna Bhai MBBS"],
        "description": "Social messages wrapped in heartwarming comedy, universal family appeal"
    },
    {
        "id": "atlee_masala",
        "director": "Atlee",
        "style": "Mass Commercial Entertainer",
        "concept": {
            "genres": ["Action", "Thriller", "Drama"],
            "tone": "Action-Packed",
            "budget_tier": "High (100Cr+)",
            "release_type": "Theatrical",
            "language": "Hindi",
            "star_power": 10,
            "novelty_factor": 6,
            "family_appeal": 7
        },
        "reference_movies": ["Jawan", "Mersal"],
        "description": "High-octane mass entertainers with social messaging and star power"
    },
    {
        "id": "shoojit_realistic",
        "director": "Shoojit Sircar",
        "style": "Slice-of-Life Realism",
        "concept": {
            "genres": ["Drama", "Romance"],
            "tone": "Emotional",
            "budget_tier": "Low (<30Cr)",
            "release_type": "Hybrid",
            "language": "Hindi",
            "star_power": 6,
            "novelty_factor": 8,
            "family_appeal": 7
        },
        "reference_movies": ["Piku", "October", "Vicky Donor"],
        "description": "Intimate character studies with subtle humor and deep emotions"
    },
    {
        "id": "sriram_thriller",
        "director": "Sriram Raghavan",
        "style": "Neo-Noir Thriller",
        "concept": {
            "genres": ["Thriller", "Crime", "Mystery"],
            "tone": "Suspenseful",
            "budget_tier": "Medium (30-100Cr)",
            "release_type": "Hybrid",
            "language": "Hindi",
            "star_power": 7,
            "novelty_factor": 9,
            "family_appeal": 4
        },
        "reference_movies": ["Andhadhun", "Badlapur", "Agent Vinod"],
        "description": "Twisty narratives with dark humor, perfect for OTT audiences"
    },
    {
        "id": "lokesh_universe",
        "director": "Lokesh Kanagaraj",
        "style": "Connected Universe Action",
        "concept": {
            "genres": ["Action", "Crime", "Thriller"],
            "tone": "Dark",
            "budget_tier": "Medium (30-100Cr)",
            "release_type": "Theatrical",
            "language": "Tamil",
            "star_power": 8,
            "novelty_factor": 8,
            "family_appeal": 5
        },
        "reference_movies": ["Vikram", "Kaithi", "Leo"],
        "description": "Interconnected action universe with intense storytelling"
    },
    {
        "id": "vetrimaaran_raw",
        "director": "Vetrimaaran",
        "style": "Raw Social Realism",
        "concept": {
            "genres": ["Drama", "Crime", "Social"],
            "tone": "Dark",
            "budget_tier": "Low (<30Cr)",
            "release_type": "Hybrid",
            "language": "Tamil",
            "star_power": 7,
            "novelty_factor": 9,
            "family_appeal": 3
        },
        "reference_movies": ["Asuran", "Viduthalai"],
        "description": "Gritty, unflinching portrayals of social issues with powerful performances"
    },
    {
        "id": "zoya_urban",
        "director": "Zoya Akhtar",
        "style": "Urban Character Drama",
        "concept": {
            "genres": ["Drama", "Comedy", "Musical"],
            "tone": "Light",
            "budget_tier": "Medium (30-100Cr)",
            "release_type": "Theatrical",
            "language": "Hindi",
            "star_power": 8,
            "novelty_factor": 7,
            "family_appeal": 6
        },
        "reference_movies": ["Gully Boy", "Zindagi Na Milegi Dobara", "Dil Dhadakne Do"],
        "description": "Character-driven stories set in urban India with musical elements"
    },
    {
        "id": "aashiq_horror",
        "director": "Amar Kaushik",
        "style": "Commercial Horror-Comedy",
        "concept": {
            "genres": ["Horror", "Comedy", "Fantasy"],
            "tone": "Humorous",
            "budget_tier": "Medium (30-100Cr)",
            "release_type": "Theatrical",
            "language": "Hindi",
            "star_power": 7,
            "novelty_factor": 8,
            "family_appeal": 7
        },
        "reference_movies": ["Stree", "Bhediya"],
        "description": "Horror-comedy with Indian mythology, strong family entertainment"
    }
]

# Historical case studies
CASE_STUDIES = [
    {
        "title": "RRR - The Pan-India Revolution",
        "year": 2022,
        "genres": ["Action", "Drama", "Historical"],
        "budget": "550 Crore",
        "box_office": "1200 Crore",
        "key_insights": [
            "Combined two regional stars for pan-India appeal",
            "Historical setting with universal themes of friendship and freedom",
            "Visual spectacle justified high budget",
            "Music became a separate marketing tool",
            "International awards attention boosted global interest"
        ],
        "genre_strategy": "Action as spine, Drama as heart, Historical as backdrop",
        "audience_reach": {"North India": 85, "South India": 95, "Global": 78},
        "lesson": "Pan-India success comes from universal emotions wrapped in spectacular execution"
    },
    {
        "title": "Tumbbad - The Sleeper Hit",
        "year": 2018,
        "genres": ["Horror", "Fantasy", "Thriller"],
        "budget": "15 Crore",
        "box_office": "18 Crore (theatrical), 95+ OTT score",
        "key_insights": [
            "Low theatrical but became OTT sensation",
            "Unique concept with Indian mythology",
            "Word-of-mouth driven success",
            "Proved niche can become mainstream on streaming",
            "High novelty compensated for low star power"
        ],
        "genre_strategy": "Horror as hook, Fantasy as world-building, Thriller as engagement",
        "audience_reach": {"North India": 70, "South India": 65, "OTT Global": 95},
        "lesson": "OTT platforms reward novelty and quality over star power"
    },
    {
        "title": "Kantara - Regional to National",
        "year": 2022,
        "genres": ["Action", "Thriller", "Drama"],
        "budget": "16 Crore",
        "box_office": "400+ Crore",
        "key_insights": [
            "Kannada film became pan-India phenomenon",
            "Cultural authenticity resonated universally",
            "Low budget, massive ROI (25x return)",
            "Word-of-mouth and social media drove collections",
            "Proved regional stories can have national appeal"
        ],
        "genre_strategy": "Action for mass appeal, Cultural drama as differentiator",
        "audience_reach": {"North India": 80, "South India": 95, "Global": 70},
        "lesson": "Authentic regional stories with universal themes can break all barriers"
    },
    {
        "title": "Everything Everywhere All at Once - Global Indie Success",
        "year": 2022,
        "genres": ["Sci-Fi", "Comedy", "Drama"],
        "budget": "25 Million USD",
        "box_office": "140 Million USD + Awards",
        "key_insights": [
            "Unconventional genre mix worked brilliantly",
            "Asian representation drove cultural connection",
            "Low budget with creative visual solutions",
            "Awards momentum boosted theatrical run",
            "Family themes at core despite wild premise"
        ],
        "genre_strategy": "Sci-Fi as playground, Comedy as accessibility, Drama as anchor",
        "audience_reach": {"US": 90, "Asia": 85, "Global": 88},
        "lesson": "Bold genre mixing works when anchored by universal family emotions"
    },
    {
        "title": "Dangal - The Global Indian Film",
        "year": 2016,
        "genres": ["Biographical", "Drama", "Social"],
        "budget": "70 Crore",
        "box_office": "2100 Crore (worldwide)",
        "key_insights": [
            "Became highest-grossing Indian film in China",
            "True story added credibility and emotional weight",
            "Social message (women empowerment) resonated globally",
            "Star power (Aamir Khan) + content quality = unstoppable",
            "Family-friendly content maximized audience reach"
        ],
        "genre_strategy": "Biography for authenticity, Drama for emotion, Social for relevance",
        "audience_reach": {"India": 95, "China": 90, "Global": 85},
        "lesson": "True stories with social relevance + star power = global blockbuster potential"
    }
]

# ROI calculation benchmarks
ROI_BENCHMARKS = {
    "High (100Cr+)": {
        "avg_theatrical_multiplier": 2.5,
        "avg_ott_value_pct": 30,
        "breakeven_multiplier": 2.0,
        "risk_factor": 0.4
    },
    "Medium (30-100Cr)": {
        "avg_theatrical_multiplier": 3.0,
        "avg_ott_value_pct": 40,
        "breakeven_multiplier": 2.5,
        "risk_factor": 0.3
    },
    "Low (<30Cr)": {
        "avg_theatrical_multiplier": 4.0,
        "avg_ott_value_pct": 60,
        "breakeven_multiplier": 3.0,
        "risk_factor": 0.2
    }
}

def calculate_roi(concept: Dict, prediction: Dict) -> Dict:
    """Calculate estimated ROI for a film concept"""
    budget_tier = concept.get("budget_tier", "Medium (30-100Cr)")
    benchmarks = ROI_BENCHMARKS.get(budget_tier, ROI_BENCHMARKS["Medium (30-100Cr)"])
    
    overall_score = prediction["overall_score"]
    theatrical = prediction["market_scores"]["theatrical_potential"]
    ott = prediction["market_scores"]["ott_potential"]
    
    # Estimate budget
    budget_ranges = {
        "Low (<30Cr)": 15,
        "Medium (30-100Cr)": 60,
        "High (100Cr+)": 150
    }
    est_budget = budget_ranges.get(budget_tier, 60)
    
    # Score multiplier (higher score = higher returns)
    score_multiplier = (overall_score / 70) ** 1.5
    
    # Theatrical revenue estimate
    theatrical_multiplier = benchmarks["avg_theatrical_multiplier"] * score_multiplier * (theatrical / 80)
    est_theatrical = round(est_budget * theatrical_multiplier, 1)
    
    # OTT revenue estimate
    ott_value_pct = benchmarks["avg_ott_value_pct"] * (ott / 80)
    est_ott = round(est_budget * (ott_value_pct / 100) * score_multiplier, 1)
    
    # Total revenue
    est_total = round(est_theatrical + est_ott, 1)
    
    # ROI calculation
    roi_pct = round(((est_total - est_budget) / est_budget) * 100, 1)
    
    # Risk assessment
    risk_factor = benchmarks["risk_factor"]
    if overall_score < 65:
        risk_factor += 0.2
    if concept.get("star_power", 5) < 5:
        risk_factor += 0.1
    
    risk_level = "Low" if risk_factor < 0.3 else "Medium" if risk_factor < 0.5 else "High"
    
    return {
        "estimated_budget_cr": est_budget,
        "estimated_theatrical_cr": est_theatrical,
        "estimated_ott_value_cr": est_ott,
        "estimated_total_revenue_cr": est_total,
        "estimated_roi_pct": roi_pct,
        "theatrical_multiplier": round(theatrical_multiplier, 1),
        "risk_level": risk_level,
        "risk_factor": round(risk_factor, 2),
        "breakeven_point_cr": round(est_budget * benchmarks["breakeven_multiplier"], 1),
        "profit_estimate_cr": round(est_total - est_budget, 1)
    }
