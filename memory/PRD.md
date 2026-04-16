# CineSignal - Product Requirements Document

## Original Problem Statement
Build an AI/ML-powered model that analyzes genre performance in movies/shows across world markets (particularly India), identifies successful genre mixing patterns, serves as a guide for new directors, and helps pitch ideas to studios/OTT platforms with data-backed insights.

## Architecture
- **Backend**: FastAPI (Python 3.11) + MongoDB + scikit-learn + PyTorch
- **Frontend**: React 19 + Recharts + Tailwind CSS + Radix UI
- **ML**: Dual engine (Heuristic weighted scoring + Neural Network)
- **Database**: MongoDB for simulations and feedback storage
- **Dataset**: 500+ movies (synthetic + real Indian/Global blockbusters)

## User Personas
1. **New Directors** - Test film concepts, learn genre patterns, get data-backed confidence
2. **Studio Executives** - Evaluate pitches objectively, identify high-potential projects
3. **OTT Platform Managers** - Assess content opportunities, understand regional demand
4. **Producers** - Pitch to studios with data, optimize budget allocation

## Core Requirements
- Interactive simulator with genre/tone/budget/release/language/star power/novelty/family appeal inputs
- AI predictions with success scores (0-100), confidence levels, market fit analysis
- Genre performance analytics with charts and trend data
- Regional analysis (North India, South India, Pan-India, Global)
- Multiple success metrics (Box Office, OTT, Combined)
- Studio presentation features (PDF export, concept comparison)

## What's Been Implemented (Phase 1 - Apr 16, 2026)
### Backend (12+ API endpoints)
- POST /api/simulate - Dual ML prediction (Heuristic + Neural Network + ROI)
- GET /api/movies, /api/movies/top - Movie data with filters
- GET /api/analytics/genre-performance, /api/analytics/trends, /api/analytics/regional, /api/analytics/audience, /api/analytics/genre-combinations
- GET /api/stats, /api/metadata
- GET /api/simulations/history

### Phase 2 - Comprehensive Upgrade (Apr 16, 2026)
- Neural Network model trained (PyTorch, MAE: 7.36)
- TMDB API integration (ready for API key)
- Studio Presentation PDF export
- Concept Comparison tool (up to 5 concepts)
- ROI Calculator with revenue estimation
- Feedback system with star ratings
- Director Testing Suite (10 presets: Rajamouli, Nolan, Hirani, Atlee, etc.)
- 5 Industry Case Studies (RRR, Tumbbad, Kantara, EEAAO, Dangal)

### Frontend (5 tabs)
1. Simulator - Interactive form + dual ML results + ROI + feedback
2. Genre Analytics - Bar charts, trend lines, top combinations
3. Market Insights - Regional performance, audience segments, top movies
4. Studio Pitch - Concept comparison, PDF export
5. Director Suite - 10 director presets, 5 case studies

## Testing Results
- Backend: 100% (11/11 tests passed)
- Frontend: 100% (all UI components and integrations working)
- Overall: 100%

## Prioritized Backlog
### P0 (Critical)
- [x] Interactive Simulator
- [x] ML Prediction Engine
- [x] Genre Analytics Dashboard
- [x] Market Insights

### P1 (High)
- [x] Neural Network Model
- [x] ROI Calculator
- [x] Studio Pitch & PDF Export
- [x] Director Testing Suite
- [x] Feedback System
- [ ] TMDB API key configuration for live data

### P2 (Medium)
- [ ] User authentication for saved simulations
- [ ] Advanced neural network with more features
- [ ] Real-time TMDB data enrichment
- [ ] Email report delivery
- [ ] Multi-user collaboration

### P3 (Low/Future)
- [ ] Mobile responsive optimization
- [ ] API rate limiting and authentication
- [ ] White-label studio dashboards
- [ ] Integration with Box Office India/Sacnilk for real-time data
- [ ] Director/Actor profile pages with track records

## Next Tasks
1. Configure TMDB API key for live movie data
2. Add user authentication for saved sessions
3. Expand dataset with more regional cinema
4. Add actor/director performance tracking
5. Build email report delivery system
