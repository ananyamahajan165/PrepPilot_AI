# VerbaAI — Production Folder Structure

Full file tree as shipped, with a one-line purpose for every file. `backend/`
and `frontend/` are independent deployables (see `DEPLOYMENT.md`) that share
nothing but the HTTP API contract.

```
VerbaAI/
├── README.md                        Project overview, features, API reference, architecture notes
├── DEPLOYMENT.md                    Step-by-step production deployment guide
├── ENVIRONMENT_VARIABLES.md         Every env var, what it does, how to generate secrets
├── PROJECT_STRUCTURE.md             This file
├── .gitignore                       node_modules/, dist/, .env, *.log, .DS_Store
│
├── backend/
│   ├── package.json
│   ├── .env.example                Template — copy to .env and fill in real values
│   └── src/
│       ├── server.js                Entry point: connects Mongo, then starts the HTTP server
│       ├── app.js                   Express app: Helmet, CORS, rate limiting, route mounting, 404/error handlers
│       │
│       ├── config/
│       │   └── db.js                Mongoose connection setup
│       │
│       ├── models/                  Mongoose schemas — the only source of truth for data shape
│       │   ├── User.js               name, email, password (hashed), profile fields, refreshTokens[]
│       │   ├── CommunicationSession.js  transcript, scores, filler words, full coaching feedback
│       │   ├── InterviewSession.js   question, answer, 5 scores, suggestions
│       │   └── ResumeReport.js       ATS score, summary, strengths/weaknesses/keywords/suggestions
│       │
│       ├── controllers/             Business logic — one file per feature, all real DB operations
│       │   ├── authController.js     signup, login, refresh (rotation), logout, me
│       │   ├── communicationController.js  analyze, history (search/filter/paginate), getSession, delete
│       │   ├── interviewController.js   categories, Gemini-generated questions, batch-scored submit, history
│       │   ├── resumeController.js   PDF text extraction, Gemini analysis, history, single-report detail
│       │   ├── dashboardController.js   every live-computed aggregate stat (streaks, goals, trends, timeline)
│       │   └── profileController.js  get/update profile, change password, avatar, cascading account deletion
│       │
│       ├── routes/                  One Express Router per feature; validation rules live here
│       │   ├── authRoutes.js
│       │   ├── communicationRoutes.js
│       │   ├── interviewRoutes.js
│       │   ├── resumeRoutes.js
│       │   ├── dashboardRoutes.js
│       │   └── profileRoutes.js
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js     JWT verification + user lookup ("protect")
│       │   ├── validate.js           Turns express-validator failures into a consistent 400
│       │   ├── rateLimiter.js        General (300/15min) and auth-specific (20/15min) limiters
│       │   └── uploadMiddleware.js   Multer config (PDF-only, 5MB) + error normalization
│       │
│       └── utils/
│           ├── apiResponse.js        success()/error() — the response envelope every route uses
│           ├── generateToken.js      Access + refresh token signing
│           ├── cookieConfig.js       Shared refresh-cookie name/path (used by auth + profile controllers)
│           ├── geminiClient.js       Single shared askGeminiJSON() wrapper for every AI feature
│           ├── interviewCategories.js  Fixed category list (a UI menu, not question content)
│           └── fillerWordDetector.js  Deterministic regex-based filler-word counting
│
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.ts                Dev server + /api proxy to the backend
    ├── tailwind.config.js            Design tokens: light "brand" palette + dark "ink/gold/teal" palette
    ├── tsconfig.json
    ├── postcss.config.js
    ├── .env.example                 Template — copy to .env
    └── src/
        ├── main.tsx                  React root, StrictMode
        ├── App.tsx                   Router: all routes, ErrorBoundary + ToastProvider + AuthProvider wiring
        ├── index.css                 Tailwind entry, base font, reduced-motion handling
        │
        ├── context/
        │   ├── AuthContext.tsx        User/session state, login/signup/logout, silent refresh-on-mount
        │   └── ToastContext.tsx       App-wide toast notification system
        │
        ├── hooks/
        │   └── useVoiceRecorder.ts   SpeechRecognition + MediaRecorder combined, with unmount cleanup
        │
        ├── routes/
        │   └── ProtectedRoute.tsx    Auth gate for every authenticated page
        │
        ├── lib/
        │   ├── api.ts                 Axios instance: in-memory access token, auto-refresh interceptor
        │   ├── download.ts            Client-side file download helper (shared by history export buttons)
        │   ├── formatTime.ts          Shared mm:ss duration formatter
        │   └── scoreColor.ts          Single source of truth for score-quality color thresholds
        │
        ├── components/
        │   ├── Navbar.tsx             Light-theme authenticated nav (with mobile menu)
        │   ├── Layout.tsx             Light-theme page shell (wraps Navbar + content)
        │   ├── DarkLayout.tsx         Dark-theme nav + shell, used only by Communication Coach pages
        │   ├── ErrorBoundary.tsx      Class component catching render-time crashes app-wide
        │   │
        │   ├── ui/                   Cross-feature primitives
        │   │   ├── motion.tsx          Reveal, FadeIn, StatCounter (shared animation building blocks)
        │   │   └── ProgressRing.tsx    Shared SVG circular progress ring
        │   │
        │   ├── dashboard/             Command-center widgets (10 files: goals, streak, timeline, etc.)
        │   ├── communication/         Mic recorder, score cards, thinking indicator, results panel
        │   ├── interview/             Question progress nav, session timer, score bar, results
        │   ├── resume/                Upload zone, report detail, text-report formatter, types
        │   ├── profile/               Avatar uploader, skills chip input, delete-account flow
        │   └── landing/               11 marketing-page section components (dark theme)
        │
        └── pages/                    One component per route
            ├── Landing.tsx
            ├── Login.tsx / Signup.tsx
            ├── Dashboard.tsx
            ├── CommunicationCoach.tsx / CommunicationHistory.tsx
            ├── InterviewPractice.tsx / InterviewHistory.tsx
            ├── ResumeAnalyzer.tsx / ResumeHistory.tsx
            ├── Profile.tsx
            └── NotFound.tsx           404 catch-all
```

## Architectural boundaries worth knowing

- **MVC on the backend**: routes only wire up validation + call a controller
  function; controllers only talk to models and `utils/`; models only
  define schema. No controller reaches into another controller.
- **Feature-folder components on the frontend**: `components/<feature>/` is
  only ever imported by that feature's page(s) — `components/ui/` and
  `lib/` are the only things every feature is allowed to share, which is
  where genuinely-reusable logic (score coloring, time formatting, motion
  primitives, the progress ring) lives after being consolidated out of
  per-feature duplicates.
- **Two navigation shells, one light system**: `Layout`/`Navbar` (light)
  wrap every page except the Communication Coach and its history page,
  which use `DarkLayout` instead — a deliberate choice, not an oversight
  (see the README's "Notes on Design Choices").
