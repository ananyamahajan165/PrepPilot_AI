# VerbaAI — Environment Variables Reference

Copy `.env.example` → `.env` in both `backend/` and `frontend/` and fill in
real values. **Never commit a real `.env` file** — both are already covered
by `.gitignore`.

## Backend (`backend/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `PORT` | No (defaults to `5001`) | `5001` | Port the Express server listens on. |
| `MONGODB_URI` | **Yes** | `mongodb://127.0.0.1:27017/verbaai` or an Atlas `mongodb+srv://...` string | Connection string for MongoDB. |
| `CLIENT_URL` | **Yes** | `http://localhost:5173` | The frontend's origin. Used by the `cors` middleware to decide which origin can call the API, and as the scope for cookie-related behavior. Must be updated to the real deployed frontend URL in production. |
| `NODE_ENV` | Recommended | `development` / `production` | When set to `production`, the refresh-token cookie is issued with `Secure` + `SameSite=None` (required for cross-domain cookies in production, e.g. a Vercel frontend talking to a Render backend). Leave as `development` for local work. |
| `JWT_SECRET` | **Yes** | a long random string | Signs short-lived **access tokens**. Generate with `openssl rand -hex 32` or similar. |
| `JWT_EXPIRES_IN` | No (defaults to `15m`) | `15m` | Access token lifetime. Kept short deliberately — see Authentication Architecture in the README. |
| `REFRESH_TOKEN_SECRET` | **Yes** | a long random string, **different from `JWT_SECRET`** | Signs long-lived **refresh tokens**, delivered only via an httpOnly cookie. Using a separate secret means a leaked access token alone can never be used to mint new sessions. |
| `REFRESH_TOKEN_EXPIRES_IN_SHORT` | No (defaults to `1d`) | `1d` | Refresh token lifetime when "remember me" is **off**. |
| `REFRESH_TOKEN_EXPIRES_IN_LONG` | No (defaults to `30d`) | `30d` | Refresh token lifetime when "remember me" is **on**. |
| `GEMINI_API_KEY` | **Yes** | from https://aistudio.google.com/app/apikey | Powers every AI feature (Communication Coach, Interview Practice question generation and scoring, Resume Analyzer). Server-side only — never sent to the frontend. |

## Frontend (`frontend/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | `/api` (local, via the Vite dev proxy) or `https://your-backend.onrender.com/api` (production) | Base URL the frontend's axios instance (`lib/api.ts`) prefixes every request with. Locally, `/api` works because `vite.config.ts` proxies it to `http://localhost:5001`; in production it must be the full deployed backend URL. |

## Generating strong secrets

```bash
# Generate a random 64-character hex secret (do this twice — once each for
# JWT_SECRET and REFRESH_TOKEN_SECRET, and use two DIFFERENT values):
openssl rand -hex 32
```

## What's intentionally *not* an environment variable

- **Rate limit thresholds** (`middleware/rateLimiter.js`) and **daily/weekly
  goal targets** (`controllers/dashboardController.js`) are hardcoded
  product constants, not secrets or per-environment config — they're the
  same rule in every environment, similar to a fitness app's fixed
  step-count goal.
- **The Gemini model name** (`gemini-1.5-flash`) is set directly in
  `utils/geminiClient.js` rather than as an env var, since switching models
  is a code-level decision, not a deployment-time config choice.
