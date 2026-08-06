<<<<<<< HEAD
# VerbaAI — AI Confidence & Communication Coach

A full MERN-stack placement-prep platform: students practice spoken and
written communication, prepare for interviews, get instant AI-scored
feedback, and analyze their resumes — all backed by a real MongoDB database
and a real Express API. Every number on every screen is computed live from
real documents; nothing is mocked, hardcoded, or estimated.

## Tech Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express (MVC architecture)
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens) + bcrypt
- **AI:** Google Gemini API (`@google/genai`, `gemini-3.5-flash`)

## Features

1. **Auth** — signup, login, logout, JWT access + refresh tokens (httpOnly
   cookie, single-use rotation), protected routes, "remember me"
2. **AI Confidence & Communication Coach (flagship)** — text or voice input
   (Web Speech API + MediaRecorder with live waveform/timer), scored on
   confidence, communication, professionalism, grammar, vocabulary, and
   fluency, plus positive feedback, areas of improvement, a rewritten
   "more confident" response, interview tips, a practice exercise, a daily
   challenge, and deterministic filler-word detection. Every session saved
   to MongoDB; history is searchable, filterable, deletable, and exportable.
3. **Interview Practice** — pick a category, difficulty, and question count;
   questions are generated fresh by Gemini for every session (never
   hardcoded). Every answer is scored on grammar, communication, technical
   quality, confidence, and professionalism, with a progress indicator,
   session timer, and free question navigation.
4. **Resume Analyzer** — upload a PDF, get a real ATS score, a rewritten
   professional summary, missing keywords, grammar issues, formatting
   suggestions, strengths/weaknesses, and general suggestions. Full report
   history with expandable detail and a downloadable formatted report.
5. **Dashboard** — a real command center, computed live from MongoDB: never
   looks empty even for a brand-new account. Quick actions, daily/weekly
   goals, learning streak, a rule-based "recommended practice" card, a
   4-stage learning path, live statistics, grammar/vocabulary/confidence
   trend indicators, a 14-day progress timeline, and a unified recent
   activity feed across all three practice modules.
6. **Profile** — avatar upload, personal details, bio, college, branch,
   skills, GitHub/LinkedIn, change password, delete account (cascades real
   data deletion across every collection), and a live-computed profile
   completion indicator.
7. **App-wide infrastructure** — toast notifications, skeleton loading
   states, a 404 page, a React error boundary, and accessible (labeled,
   keyboard-navigable) forms throughout.

## Project Structure
```
VerbaAI/
├── backend/
│   └── src/
│       ├── config/db.js
│       ├── models/        User, CommunicationSession, InterviewSession, ResumeReport
│       ├── controllers/    auth, communication, interview, resume, dashboard, profile
│       ├── routes/         one router per feature, mounted in app.js
│       ├── middleware/     authMiddleware (JWT guard), uploadMiddleware (multer,
│       │                   normalizes file errors to 400s), validate, rateLimiter
│       ├── utils/          apiResponse, cookieConfig, generateToken, geminiClient
│       │                   (shared AI call), interviewCategories, fillerWordDetector
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── context/         AuthContext, ToastContext
        ├── hooks/           useVoiceRecorder (SpeechRecognition + MediaRecorder)
        ├── routes/          ProtectedRoute
        ├── components/
        │   ├── dashboard/   command-center widgets (goals, streak, timeline, etc.)
        │   ├── communication/  mic recorder, score cards, results panel
        │   ├── interview/   question progress, session timer, results
        │   ├── resume/      upload zone, report detail, formatters
        │   ├── profile/     avatar uploader, skills input, delete-account flow
        │   ├── landing/     marketing page sections (dark theme)
        │   ├── ui/          shared motion primitives, progress ring
        │   ├── Navbar, Layout        — light-theme authenticated shell
        │   ├── DarkLayout             — dark-theme shell (Communication Coach only)
        │   └── ErrorBoundary
        ├── pages/           Landing, Login, Signup, Dashboard, CommunicationCoach,
        │                    CommunicationHistory, InterviewPractice, InterviewHistory,
        │                    ResumeAnalyzer, ResumeHistory, Profile, NotFound
        ├── lib/             api.ts (axios, in-memory token + auto-refresh),
        │                    download.ts, formatTime.ts, scoreColor.ts
        ├── App.tsx          router
        └── main.tsx
```

## Database Schemas (Mongoose)
- **User**: name, email, password (hashed), avatarUrl, bio, college, branch,
  skills[], github, linkedin, refreshTokens[] (hashed)
- **CommunicationSession**: user, inputMethod (text/voice), transcript,
  wordCount, durationSeconds, fillerWordCount, fillerWordsFound[],
  scores { confidence, communication, professionalism, grammar, vocabulary,
  fluency }, overallScore, positiveFeedback[], areasOfImprovement[],
  detailedExplanation, suggestedResponse, interviewTips[], practiceExercise,
  dailyChallenge, motivationalMessage
- **InterviewSession**: user, category, difficulty, question, answer,
  grammarScore, communicationScore, technicalScore, confidenceScore,
  professionalismScore, overallScore, suggestions[]
- **ResumeReport**: user, fileName, atsScore, professionalSummary,
  strengths[], weaknesses[], missingKeywords[], grammarIssues[],
  formattingSuggestions[], suggestions[]

## API Routes
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh           (reads httpOnly refresh cookie, rotates it, returns new access token)
POST   /api/auth/logout            (revokes this device's refresh token, clears cookie)
GET    /api/auth/me                (protected)

POST   /api/communication/analyze          (protected)
GET    /api/communication/history          (protected, ?search=&type=&page=&limit=)
GET    /api/communication/history/:id      (protected)
DELETE /api/communication/history/:id      (protected)

GET    /api/interview/categories   (protected)
POST   /api/interview/questions    (protected, Gemini-generated, never hardcoded)
POST   /api/interview/submit       (protected, batch: {category, difficulty, answers: [{question, answer}]})
GET    /api/interview/history      (protected)

POST   /api/resume/analyze         (protected, multipart "resume" field)
GET    /api/resume/history         (protected, lightweight list)
GET    /api/resume/history/:id     (protected, full report detail)

GET    /api/dashboard              (protected)

GET    /api/profile                (protected, full profile + computed profileCompletion)
PUT    /api/profile                (protected, name/email/bio/college/branch/skills/github/linkedin)
PUT    /api/profile/password       (protected)
PUT    /api/profile/avatar         (protected, base64 image data URL, max ~3MB)
DELETE /api/profile                (protected, requires password, cascades data deletion)
```

## Running Locally

### 1. MongoDB
Have a MongoDB instance running locally (or use MongoDB Atlas) and grab its
connection string.

### 2. Gemini API Key
Get a free key at https://aistudio.google.com/app/apikey

### 3. Environment variables
```bash
cp backend/.env.example backend/.env
# fill in MONGODB_URI, JWT_SECRET, REFRESH_TOKEN_SECRET, GEMINI_API_KEY

cp frontend/.env.example frontend/.env
```

### 4. Development
This is an npm workspaces monorepo — one install, one command, from the
**project root**:
```bash
npm install
npm run dev
```
That single command installs both `backend/` and `frontend/` (npm workspaces
resolves both automatically) and then runs both dev servers concurrently,
each prefixed and color-coded in the same terminal (`[backend]` / `[frontend]`).
Press `Ctrl+C` once to stop both.

- Backend: `http://localhost:5001` — visit `/api/health` to confirm it's up
- Frontend: `http://localhost:5173`

Prefer to run just one side? `npm run dev:backend` or `npm run dev:frontend`
still work individually.

### 5. Production
```bash
npm run build   # builds the frontend (frontend/dist)
npm start       # starts the backend's production server
```
The backend and frontend are deployed separately in production (see
**Deployment** below) — `npm start` runs the API server; the built frontend
in `frontend/dist` is what you deploy to a static host.

### 6. Try it
Sign up → try the Communication Coach with a spoken or typed response → try
an Interview Practice question → upload a resume PDF → check the Dashboard
for real numbers pulled from MongoDB.

## Deployment
See `DEPLOYMENT.md` for the full step-by-step guide. Short version:
- **Backend:** Render / Railway (set env vars in the dashboard)
- **Frontend:** Vercel / Netlify (set `VITE_API_URL` to your deployed backend URL)
- Update `CLIENT_URL` in the backend's env to your deployed frontend URL for CORS,
  and set `NODE_ENV=production` so refresh cookies get `Secure`/`SameSite=None`.

## Security & API Conventions
- **Helmet** — sets safe HTTP headers on every response (`app.js`).
- **Rate limiting** (`express-rate-limit`) — 300 req/15min on all of `/api`,
  tightened to 20 req/15min on `/api/auth/login` and `/api/auth/register` to
  slow down brute-force/credential-stuffing attempts.
- **Request validation** (`express-validator`) — every route that accepts a
  body declares its validation rules inline; a shared `middleware/validate.js`
  turns failed checks into a consistent `400` response before the controller
  ever runs.
- **Consistent response envelope** (`utils/apiResponse.js`) — every success
  response is `{ success: true, ...data }` and every error is
  `{ success: false, message, ...extra }`.
- **Error handling** — the centralized handler in `app.js` never leaks raw
  internal error messages (DB driver errors, stack traces, SDK errors) to
  the client on unexpected 5xx failures; it always returns a generic
  message while the real detail is still logged server-side. Genuine 4xx
  client errors (validation, bad JSON body, file-type/size rejections from
  `middleware/uploadMiddleware.js`) still return their real, safe message.
  `middleware/authMiddleware.js` also distinguishes an actual bad/expired
  JWT (401) from a database error during the user lookup (500).
- **File upload safety** — PDFs only, 5MB cap, in-memory storage (never
  written to disk), rejected files/oversized uploads normalized to clean
  400 responses via `handleUploadErrors`.

## Authentication Architecture
- **Two-token model** — a short-lived **access token** (default 15m, signed
  with `JWT_SECRET`) is returned in the JSON body and kept only in memory on
  the client (`lib/api.ts`), never in `localStorage`. A long-lived **refresh
  token** (1d, or 30d with "remember me", signed with a *separate*
  `REFRESH_TOKEN_SECRET`) is set as an `httpOnly`, `path=/api/auth` cookie —
  unreadable by client-side JS, so an XSS bug can't steal it.
- **Refresh + rotation** (`POST /api/auth/refresh`) — the frontend calls this
  once on app load to silently restore a session from the cookie, and again
  automatically whenever a request comes back `401` (see the axios response
  interceptor in `lib/api.ts`). Each refresh is single-use: the old token is
  removed from `User.refreshTokens` and a new one issued, so a captured old
  refresh token can't be replayed after the legitimate client has rotated it.
- **Session storage** — only a SHA-256 hash of each refresh token is stored
  on the `User` document (`refreshTokens: string[]`, capped at 5 concurrent
  sessions/devices), never the raw token, so a database leak alone can't
  produce a usable session.
- **Logout** removes just that device's token hash and clears the cookie —
  other devices/sessions stay logged in. **Remember me** controls the
  refresh token's lifetime only; the access token is always short-lived.

## Notes on Design Choices (useful for interviews)
- **Questions are AI-generated, not hardcoded** — `interviewController.js`
  calls Gemini fresh for every practice session (uniqueness and difficulty
  calibration enforced in the prompt); only the *category list* is a fixed
  UI menu, and only real *answers* are ever stored.
- **Shared Gemini wrapper** (`utils/geminiClient.js`) — all AI features call
  the same `askGeminiJSON()` helper instead of duplicating API/parsing logic;
  each controller just writes its prompt.
- **Dark theme is scoped, not global** — only the Landing page and the
  Communication Coach (the flagship feature, explicitly requested in dark
  theme) use the dark palette, each with its own navigation shell
  (`StickyNavbar` / `DarkLayout`). The rest of the app shares one light
  design system. This avoids a jarring seam between a themed page and an
  unthemed navbar.
- **No Redux** — auth state lives in a single React Context; page-level data
  (dashboard stats, history) is fetched with local `useState`/`useEffect`,
  since nothing needs to be shared globally beyond the logged-in user.
- **Deterministic filler-word detection** — counted with a curated regex
  list server-side rather than left entirely to the LLM, so the number
  shown to the student is exact and reproducible; the detected list is fed
  back into the Gemini prompt so its coaching advice references what the
  student actually said.
- **Avatar upload** stores a base64 data URL directly on the User document
  instead of standing up a separate file-storage service — reasonable for a
  medium-sized project, though a real production app would use S3/Cloudinary.
=======
# VerbaAI

Quick run instructions for the VerbaAI workspace (backend + frontend).

Prerequisites
- Node.js (16+ recommended) and npm
- MongoDB running locally (or provide `MONGODB_URI`)

Backend (verbaai-backend)

1. Install dependencies

```bash
cd verbaai-backend
npm install
```

2. Environment (create a `.env` in `verbaai-backend` or export variables)

Example `.env`:

```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/verbaai
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENAI_API_KEY=
```

3. Run in development

```bash
npm run dev
```

4. Run tests

```bash
npm test
```

Frontend (verbaai-frontend)

1. Install dependencies

```bash
cd verbaai-frontend
npm install
```

2. Start dev server (Vite)

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

Full stack

1. Start backend first (so API is available): `verbaai-backend` -> `npm run dev`
2. Start frontend: `verbaai-frontend` -> `npm run dev`

Useful URLs
- Backend API root: http://localhost:5001/
- Frontend (Vite): http://localhost:5173/

Notes
- If you run into port conflicts, change `PORT` in the backend `.env` or pass `PORT` when starting.
- Ensure MongoDB is running or set `MONGODB_URI` to a reachable database.

If you want, I can commit this README and update the project `package.json` scripts or create a root-level script to start both services together.
>>>>>>> aac5780b3aa23e8117c4176750a877e11a031d47
