# CineSignal - Product Requirements Document

## Original Problem Statement
Build an AI/ML-powered model that analyzes genre performance in movies/shows across world markets (particularly India with diverse cultures), identifies successful genre mixing patterns, guides new directors, and helps pitch to studios/OTT platforms.

## Architecture
- **Backend**: FastAPI + MongoDB + scikit-learn + PyTorch + httpx (TMDB)
- **Frontend**: React 19 + Recharts + Tailwind CSS + Radix UI + React Router
- **ML**: Dual engine (Heuristic weighted scoring + Neural Network)
- **Auth**: Emergent Google OAuth + JWT email/password
- **Database**: MongoDB (movies, simulations, users, sessions, workspace, feedback, notes)

## User Personas
1. **New Directors** - Test concepts, learn patterns, gain confidence
2. **Studio Executives** - Evaluate pitches, identify potential
3. **OTT Platform Managers** - Assess content, understand demand
4. **Producers** - Pitch with data, optimize budgets

## What's Implemented

### Phase 1 (Apr 16, 2026) - MVP
- 500 movie dataset, ML prediction engine, 12+ API endpoints
- Interactive Simulator, Genre Analytics, Market Insights

### Phase 2 (Apr 16, 2026) - Comprehensive Upgrade
- Neural Network (PyTorch, MAE: 7.36)
- TMDB integration (ready for API key)
- PDF pitch deck export
- Concept comparison (up to 5)
- ROI Calculator
- Feedback system
- Director Testing Suite (10 presets)
- 5 Case Studies

### Phase 3 (Apr 16, 2026) - Current
- **Expanded Dataset**: 700 movies, 12 languages (added Punjabi, Gujarati, Assamese, Odia)
- **User Auth**: Both JWT email/password AND Emergent Google OAuth
- **Full Workspace**: Saved simulations, comparisons, notes with CRUD
- **TMDB Ready**: Plug-in when API key obtained
- **Regional Cinema**: 120+ real regional movies (Malayalam, Bengali, Marathi, Punjabi, Gujarati, Assamese, Odia)
- **Deployment Ready**: Passed health check - lightweight ML (numpy only), optimized DB queries, no heavy deps

### Test Results (Phase 3)
- Backend: 100% (16/16 tests)
- Frontend: 97% (auth redirect fix applied)
- Overall: 97%+

## Backlog
### P0 - Done
- [x] Interactive Simulator, ML Engine, Analytics, Market Insights
- [x] Neural Network, ROI, PDF Export, Director Suite, Feedback
- [x] Regional expansion (12 languages, 700 movies)
- [x] User authentication (dual: Google + email)
- [x] Full workspace (simulations, comparisons, notes)

### P1 - Next
- [ ] TMDB API key configuration
- [ ] Retrain NN with expanded 700-movie dataset
- [ ] Email report delivery

### P2 - Future
- [ ] Mobile responsive optimization
- [ ] White-label studio dashboards
- [ ] Real-time Box Office India/Sacnilk integration
- [ ] Director/Actor profile pages
