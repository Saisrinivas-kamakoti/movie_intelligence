"""Freeform idea analysis and development guidance for directors."""
from __future__ import annotations

import re
from typing import Dict, List

from director_testing import calculate_roi


GENRE_KEYWORDS = {
    "Action": ["fight", "war", "mission", "revenge", "chase", "gang", "police", "battle"],
    "Drama": ["family", "emotion", "relationship", "loss", "marriage", "mother", "father"],
    "Thriller": ["murder", "secret", "crime", "investigation", "conspiracy", "kidnap"],
    "Comedy": ["funny", "comedy", "chaos", "misfit", "marriage", "satire"],
    "Romance": ["love", "romance", "relationship", "heartbreak", "affair"],
    "Horror": ["ghost", "curse", "haunted", "demon", "fear", "horror"],
    "Sci-Fi": ["future", "time", "technology", "robot", "space", "experiment"],
    "Fantasy": ["myth", "kingdom", "magic", "legend", "spirit", "fantasy"],
    "Crime": ["crime", "gangster", "heist", "underworld", "smuggler"],
    "Mystery": ["missing", "mystery", "puzzle", "hidden", "unknown"],
    "Family": ["children", "parents", "home", "festival", "legacy"],
    "Historical": ["period", "empire", "freedom", "king", "historical", "colonial"],
    "Biographical": ["true story", "biopic", "real life", "champion", "leader"],
    "Social": ["village", "injustice", "caste", "education", "society", "activist"],
    "Musical": ["music", "singer", "band", "dance", "performance"],
}

TONE_HINTS = {
    "Dark": ["dark", "gritty", "violent", "bleak"],
    "Light": ["light", "gentle", "hopeful", "warm"],
    "Dramatic": ["drama", "emotion", "family", "sacrifice"],
    "Action-Packed": ["action", "battle", "mission", "fight"],
    "Emotional": ["love", "loss", "mother", "father", "heart"],
    "Suspenseful": ["mystery", "secret", "twist", "investigation", "suspense"],
    "Humorous": ["comedy", "funny", "satire", "chaos"],
}

INSPIRATION_LIBRARY = {
    "Action": {
        "books": ["The Odyssey", "The Hero With a Thousand Faces"],
        "folklores": ["Mahabharata war arcs", "Rayalaseema ballads of revenge and loyalty"],
        "cultures": ["Kalaripayattu traditions", "Telangana festival spectacle design"],
        "films": ["RRR", "Mad Max: Fury Road"],
    },
    "Drama": {
        "books": ["The Namesake", "A Fine Balance"],
        "folklores": ["Village oral histories around land and legacy", "Stories of migration in Telugu households"],
        "cultures": ["Joint family rituals", "Small-town education aspirations"],
        "films": ["Piku", "Manchester by the Sea"],
    },
    "Thriller": {
        "books": ["The Devotion of Suspect X", "Gone Girl"],
        "folklores": ["Temple-town ghost rumors", "Unsolved local legends around hidden treasure"],
        "cultures": ["Urban surveillance culture", "Media trial ecosystems"],
        "films": ["Andhadhun", "Memories of Murder"],
    },
    "Comedy": {
        "books": ["Three Men in a Boat", "Serious Men"],
        "folklores": ["Tenali Rama stories", "Village prank tales told during harvest festivals"],
        "cultures": ["Wedding chaos in Telugu households", "Hostel and coaching-center humor"],
        "films": ["3 Idiots", "Superbad"],
    },
    "Romance": {
        "books": ["Love in the Time of Cholera", "The Guide"],
        "folklores": ["Radha-Krishna retellings", "Regional ballads of forbidden love"],
        "cultures": ["Festival courtship traditions", "Diaspora long-distance relationships"],
        "films": ["Sita Ramam", "Before Sunrise"],
    },
    "Horror": {
        "books": ["The Haunting of Hill House", "Tumbbad screenplay notes and mythology studies"],
        "folklores": ["Andhra village spirit lore", "Buried temple and cursed-land legends"],
        "cultures": ["Ritual healing traditions", "Night-time rural superstition practices"],
        "films": ["Tumbbad", "The Witch"],
    },
    "Sci-Fi": {
        "books": ["Stories of Your Life and Others", "The Three-Body Problem"],
        "folklores": ["Myths of time, rebirth, and destiny", "Creation stories that can be reframed as speculative fiction"],
        "cultures": ["Indian startup ecosystems", "Climate anxiety in coastal cities"],
        "films": ["Interstellar", "Her"],
    },
    "Fantasy": {
        "books": ["The Lord of the Rings", "Aru Shah and the End of Time"],
        "folklores": ["Yakshagana legends", "Adivasi creation myths"],
        "cultures": ["Temple architecture symbolism", "Regional costume and craft traditions"],
        "films": ["Baahubali", "Pan's Labyrinth"],
    },
    "Crime": {
        "books": ["Sacred Games", "The Godfather"],
        "folklores": ["Smuggler stories from border districts", "Dock-town legends of shadow economies"],
        "cultures": ["Political patronage networks", "Police and court procedural culture"],
        "films": ["Gangs of Wasseypur", "Heat"],
    },
    "Social": {
        "books": ["Everybody Loves a Good Drought", "Why I Am Not a Hindu"],
        "folklores": ["Stories of reformers from rural Andhra", "Women-led protest narratives"],
        "cultures": ["Education mobility", "Water, land, and caste power dynamics"],
        "films": ["Article 15", "Asuran"],
    },
}

LOCATION_SUGGESTIONS = {
    "Action": [
        {"place": "Ramoji Film City backlots", "fit": "Controlled spectacle set pieces and crowd staging", "budget": "Efficient for large-scale scheduling."},
        {"place": "Ladakh / Spiti stretches", "fit": "High-contrast pursuit and survival visuals", "budget": "Travel-heavy but visually premium."},
    ],
    "Drama": [
        {"place": "Madanapalle and Chittoor belt", "fit": "Grounded family and education stories", "budget": "Cost-effective with strong local identity."},
        {"place": "Old Hyderabad neighborhoods", "fit": "Layered middle-class urban drama", "budget": "Moderate permits, rich texture."},
    ],
    "Thriller": [
        {"place": "Visakhapatnam port zones", "fit": "Industrial tension and crime atmosphere", "budget": "Moderate logistics, high production value."},
        {"place": "Rainy hill stations around Ooty", "fit": "Suspense, isolation, and visual mystery", "budget": "Weather-dependent scheduling."},
    ],
    "Romance": [
        {"place": "Pondicherry seafront", "fit": "Soft, intimate romance framing", "budget": "Moderate and production-friendly."},
        {"place": "Coorg estates", "fit": "Lush, youthful romance and introspection", "budget": "Premium look with manageable scale."},
    ],
    "Horror": [
        {"place": "Decaying zamindar houses in coastal Andhra", "fit": "Regional mythology and haunting atmosphere", "budget": "Art-direction heavy, location-rental friendly."},
        {"place": "Dense forest edges near Araku", "fit": "Folk horror and isolation", "budget": "Medium logistics, strong mood value."},
    ],
}


class DirectorIdeaAdvisor:
    def __init__(self, ml_engine):
        self.ml_engine = ml_engine

    def analyze(self, payload: Dict) -> Dict:
        mode = payload.get("mode", "analyze")
        concept_text = (payload.get("concept_text") or "").strip()
        target_genre = payload.get("target_genre")

        genres = self._infer_genres(concept_text, target_genre)
        tone = self._infer_tone(concept_text, genres)
        novelty_factor = self._infer_novelty(concept_text)
        family_appeal = self._infer_family_appeal(concept_text, genres)
        structured_concept = {
            "genres": genres,
            "tone": tone,
            "budget_tier": payload.get("budget_tier", "Medium (30-100Cr)"),
            "release_type": payload.get("release_type", "Theatrical"),
            "language": payload.get("preferred_language", "Hindi"),
            "star_power": payload.get("star_power", 5),
            "novelty_factor": novelty_factor,
            "family_appeal": family_appeal,
        }

        prediction = self.ml_engine.predict_success(structured_concept)
        roi = calculate_roi(structured_concept, prediction)
        top_genre = genres[0]

        response = {
            "mode": mode,
            "parsed_concept": {
                "summary": self._build_summary(concept_text, genres, tone),
                "genres": genres,
                "tone": tone,
                "market_positioning": self._market_positioning(prediction),
            },
            "prediction": {
                **prediction,
                "roi_estimate": roi,
            },
            "development_notes": {
                "strengths": self._concept_strengths(concept_text, genres, prediction),
                "improvement_moves": self._improvement_moves(concept_text, genres, prediction),
                "budget_adjustments": self._budget_adjustments(structured_concept, concept_text, roi),
                "mix_pattern_score": self._mix_pattern_score(genres, prediction),
                "pitch_packaging": self._pitch_packaging(structured_concept, prediction),
            },
            "inspiration_map": self._inspiration_map(genres),
            "locations": self._location_map(top_genre),
            "director_kpis": self._director_kpis(genres, structured_concept["release_type"]),
        }

        if mode == "generate":
            response["story_directions"] = self._story_directions(target_genre or top_genre, structured_concept["language"])

        return response

    def _infer_genres(self, concept_text: str, target_genre: str | None) -> List[str]:
        matches = []
        lower_text = concept_text.lower()
        for genre, keywords in GENRE_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in lower_text)
            if score:
                matches.append((genre, score))

        matches.sort(key=lambda item: item[1], reverse=True)
        genres = [genre for genre, _ in matches[:3]]

        if target_genre and target_genre not in genres:
            genres.insert(0, target_genre)
        if not genres:
            genres = [target_genre or "Drama", "Thriller"]
        return genres[:3]

    def _infer_tone(self, concept_text: str, genres: List[str]) -> str:
        lower_text = concept_text.lower()
        scores = {}
        for tone, hints in TONE_HINTS.items():
            scores[tone] = sum(1 for hint in hints if hint in lower_text)

        best_tone = max(scores, key=scores.get)
        if scores[best_tone] > 0:
            return best_tone
        if "Action" in genres:
            return "Action-Packed"
        if "Comedy" in genres:
            return "Humorous"
        if "Thriller" in genres or "Mystery" in genres:
            return "Suspenseful"
        return "Dramatic"

    def _infer_novelty(self, concept_text: str) -> int:
        novelty_terms = ["unexpected", "myth", "future", "unusual", "rare", "parallel", "folk", "experimental"]
        count = sum(1 for term in novelty_terms if term in concept_text.lower())
        return max(5, min(9, 5 + count))

    def _infer_family_appeal(self, concept_text: str, genres: List[str]) -> int:
        text = concept_text.lower()
        if any(term in text for term in ["family", "children", "parents", "friendship", "festival"]):
            return 8
        if any(genre in genres for genre in ["Horror", "Crime"]):
            return 4
        if "Action" in genres:
            return 6
        return 7

    def _build_summary(self, concept_text: str, genres: List[str], tone: str) -> str:
        if concept_text:
            cleaned = re.sub(r"\s+", " ", concept_text).strip()
            return cleaned[:220]
        return f"A {tone.lower()} {', '.join(genres)} project aimed at a commercially clear audience."

    def _market_positioning(self, prediction: Dict) -> str:
        india_fit = prediction["market_scores"]["india_fit"]
        global_fit = prediction["market_scores"]["global_fit"]
        if india_fit >= global_fit + 8:
            return "India-first theatrical or hybrid positioning with regional emotional anchors."
        if global_fit >= india_fit + 8:
            return "Premium exportable concept with stronger international packaging potential."
        return "Balanced pan-India and OTT positioning with room for crossover packaging."

    def _concept_strengths(self, concept_text: str, genres: List[str], prediction: Dict) -> List[str]:
        strengths = [
            f"The current genre spine leans toward {genres[0]}, which already has measurable audience demand in the model.",
            f"The concept shows {prediction['label'].lower()} with especially strong {'OTT' if prediction['market_scores']['ott_potential'] > prediction['market_scores']['theatrical_potential'] else 'theatrical'} upside.",
        ]
        if concept_text and len(concept_text.split()) > 30:
            strengths.append("You already have enough story texture in the idea to discuss character, world, and emotional promise in a pitch meeting.")
        else:
            strengths.append("The idea is simple enough to be pitched quickly, which is useful if you sharpen the protagonist and conflict further.")
        return strengths

    def _improvement_moves(self, concept_text: str, genres: List[str], prediction: Dict) -> List[str]:
        moves = [
            "Reduce the concept to one protagonist, one central conflict, and one emotional promise before adding subplots.",
            "Make the genre hierarchy explicit: decide what is the core genre, what is the support genre, and what should remain texture only.",
            "Write a one-line audience hook that explains why viewers should care in the first trailer, not after the interval.",
        ]
        if len(genres) >= 3:
            moves.append("Three active genres already create complexity; keep the third genre in the background unless it changes the ending or marketing hook.")
        if prediction["market_scores"]["ott_potential"] > prediction["market_scores"]["theatrical_potential"]:
            moves.append("Build stronger episodic turns, cliffhangers, or reveal moments if you want to maximize OTT completion and retention.")
        else:
            moves.append("Add one or two large-scale cinematic moments that justify theatrical marketing and a premium ticket experience.")
        return moves

    def _budget_adjustments(self, concept: Dict, concept_text: str, roi: Dict) -> List[str]:
        notes = [
            f"Current model budget lane: {concept['budget_tier']}. Estimated breakeven sits around {roi['breakeven_point_cr']} Cr.",
        ]
        lower_text = concept_text.lower()
        if any(term in lower_text for term in ["war", "kingdom", "period", "vfx", "fantasy"]):
            notes.append("If the script depends on world-building, cut location count and consolidate spectacle into 2-3 unforgettable set pieces instead of spreading VFX across the whole film.")
        else:
            notes.append("Keep cost discipline by using a limited location strategy, fewer night shoots, and stronger writing in place of expensive scale.")
        if concept["release_type"] == "OTT":
            notes.append("For OTT-first projects, prioritize writing, sound design, and performance depth over star-heavy casting or oversized action blocks.")
        else:
            notes.append("For theatrical projects, reserve spend for interval spike moments, songs, action, or emotional peaks that can power trailers and opening weekend.")
        return notes

    def _mix_pattern_score(self, genres: List[str], prediction: Dict) -> Dict:
        overloaded = len(genres) >= 3 and prediction["overall_score"] < 72
        if overloaded:
            signal = "Commercially confusing"
        elif len(genres) == 3:
            signal = "Potentially rich but needs tight tonal control"
        else:
            signal = "Clean commercial mix"
        return {
            "signal": signal,
            "score": prediction["overall_score"],
            "reason": f"The current blend of {' + '.join(genres)} maps to {prediction['label'].lower()} in the predictor.",
        }

    def _pitch_packaging(self, concept: Dict, prediction: Dict) -> Dict:
        ott_strength = prediction["market_scores"]["ott_potential"]
        theatrical_strength = prediction["market_scores"]["theatrical_potential"]
        return {
            "greenlight_hook": f"{' + '.join(concept['genres'])} idea with {prediction['label'].lower()} and {prediction['confidence'].lower()} confidence.",
            "positioning_guidance": "Lead with audience promise, then genre structure, then budget discipline, then comparable titles.",
            "risk_flags": prediction["risk_factors"],
            "window_recommendation": "OTT-first" if ott_strength > theatrical_strength + 5 else "Theatrical-first" if theatrical_strength > ott_strength + 5 else "Hybrid release discussion",
        }

    def _inspiration_map(self, genres: List[str]) -> Dict:
        reference = INSPIRATION_LIBRARY.get(genres[0], INSPIRATION_LIBRARY["Drama"])
        return {
            "books": reference["books"],
            "folklores": reference["folklores"],
            "cultures": reference["cultures"],
            "film_references": reference["films"],
        }

    def _location_map(self, primary_genre: str) -> List[Dict]:
        return LOCATION_SUGGESTIONS.get(primary_genre, LOCATION_SUGGESTIONS["Drama"])

    def _director_kpis(self, genres: List[str], release_type: str) -> List[Dict]:
        return [
            {"name": "Hook clarity", "why_it_matters": "Can the film be sold in one line to actors, producers, and trailer editors?"},
            {"name": "Genre discipline", "why_it_matters": f"New directors should prove they can control the {genres[0].lower()} spine without tonal drift."},
            {"name": "Character payoff", "why_it_matters": "Audience satisfaction usually comes from emotional payoff, not idea complexity alone."},
            {"name": "Budget-to-screen value", "why_it_matters": "Studios look for whether every major spend shows up on screen."},
            {"name": "Audience retention", "why_it_matters": f"{'OTT' if release_type == 'OTT' else 'Theatrical'} projects need strong scene-level momentum and no dead middle."},
            {"name": "Cultural specificity", "why_it_matters": "Authentic detail helps the film feel original while still remaining marketable."},
        ]

    def _story_directions(self, genre: str, language: str) -> List[Dict]:
        base = {
            "Action": [
                "A debt-ridden ambulance driver is forced into one final night mission across a politically tense city.",
                "A forgotten folk sport becomes the cover for a revenge drama between two rival clans.",
            ],
            "Thriller": [
                "A school principal uncovers a quiet network of exam manipulation tied to local power brokers.",
                "A missing-person case in a temple town reveals a decades-old pact that everyone still protects.",
            ],
            "Drama": [
                "Three siblings return to sell their ancestral home and discover each one has hidden a different truth from the parents.",
                "A government teacher in a rural town becomes the reluctant bridge between two feuding communities.",
            ],
            "Horror": [
                "A family inherits a lakeside property where every festival revives an unfinished ritual.",
                "A film unit shooting folklore content realizes the spirit story was documenting them back.",
            ],
        }
        prompts = base.get(genre, base["Drama"])
        return [
            {
                "title": f"{genre} direction {index + 1}",
                "logline": prompt,
                "language_note": f"Could be developed in {language} while borrowing local cultural texture for authenticity.",
            }
            for index, prompt in enumerate(prompts)
        ]
