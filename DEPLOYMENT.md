# Deployment Guide

This repository is a full-stack app:

- `frontend/` = React app
- `backend/` = FastAPI API

## Recommended deployment stack

### Netlify-only deployment

This app can now run as a static Netlify deployment with no paid backend.

The repo includes a root `netlify.toml` configured for the React frontend inside `frontend/`.

Netlify import settings:

- Repository root: this repo
- Base directory: `frontend`
- Build command: `npm install --legacy-peer-deps && npm run build`
- Publish directory: `build`

Environment variables:

- None required for the Netlify-only version
- Optional future API mode:
- `REACT_APP_DATA_MODE=hybrid`
- `REACT_APP_API_BASE=https://your-api.example.com`

The included `netlify.toml` and `frontend/public/_redirects` ensure React Router routes resolve to `index.html`.
The Netlify config also pins `NODE_VERSION=20` to avoid older runtime issues.

### What works in the Netlify-only version

- Film concept simulator
- Genre analytics
- Market intelligence dashboard
- Director presets
- Director idea lab
- Concept comparison
- Browser-local workspace
- Browser-local sign-in and saved notes

### Important tradeoff

This version uses:

- local browser storage instead of MongoDB
- browser-local auth instead of production OAuth
- downloadable pitch briefs instead of backend-generated PDFs

That makes it fully deployable on free Netlify hosting without Render.

## Future backend-ready mode

The frontend now uses a shared client wrapper instead of calling the local runtime directly.

- `frontend/src/lib/cinesignalClient.js` chooses between browser-local mode and a future API mode.
- If you later deploy an API, you can keep the same UI and switch the frontend with:
- `REACT_APP_DATA_MODE=hybrid`
- `REACT_APP_API_BASE=https://your-api.example.com`
- If the API is unreachable, the client falls back to the browser runtime so demos do not fully break.

## One-click Netlify checklist

After importing the repo into Netlify:

1. Confirm the build uses `frontend/`
2. Deploy the site
3. Open the generated `https://...netlify.app` URL
4. Test simulator, analytics, director suite, and workspace in the browser
