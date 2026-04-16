# Deployment Guide

This repository is a full-stack app:

- `frontend/` = React app
- `backend/` = FastAPI API

## Recommended free deployment

### Frontend

Deploy `frontend/` to Vercel.

Settings:

- Framework preset: `Create React App`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `build`
- Environment variable:
  - `REACT_APP_BACKEND_URL=https://your-backend-service.onrender.com`

The included `frontend/vercel.json` rewrites all routes to `index.html` so React Router works in production.
Use `frontend/.env.sample` as the template for frontend environment variables.

### Backend

Deploy `backend/` to Render.

Settings:

- Runtime: `Python`
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

Environment variables:

- `MONGO_URL`
- `DB_NAME`
- `CORS_ORIGINS`
- `TMDB_API_KEY` (optional but recommended)

The included `render.yaml` can be used with Render Blueprint deployment.
Use `backend/.env.sample` as the template for backend environment variables.

### Database

Use MongoDB Atlas free tier.

Create a database and set:

- `MONGO_URL`
- `DB_NAME=cinesignal`

### Important note on auth

Google OAuth uses Emergent session exchange and depends on:

- frontend origin matching the deployed frontend URL
- backend cookies being sent cross-site
- `CORS_ORIGINS` including the deployed frontend origin

For production:

- frontend and backend must both be on HTTPS
- the backend cookie settings already expect secure cross-site usage

## Suggested rollout order

1. Deploy backend on Render
2. Copy backend URL
3. Deploy frontend on Vercel with `REACT_APP_BACKEND_URL`
4. Add frontend URL to backend `CORS_ORIGINS`
5. Test login, simulator, analytics, and workspace features
