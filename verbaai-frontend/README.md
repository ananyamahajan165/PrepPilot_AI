# VerbaAI — Run Guide

This repo has two independent apps that run as two separate processes:

- `verbaai-backend` — Express + MongoDB API, runs on **http://localhost:5001**
- `verbaai-frontend` — React + Vite app, runs on **http://localhost:5173**

There's no single command that starts both (no root `package.json`), so you run
them in two terminals.

## 1. Prerequisites

- Node.js 18+ (you have v22, that's fine)
- A MongoDB instance. Either:
  - Install MongoDB locally and make sure `mongod` is running on `localhost:27017`, or
  - Use a free MongoDB Atlas cluster and put its connection string in `MONGODB_URI`
- (Optional, only needed for AI interview/resume features) an OpenAI API key

## 2. Install dependencies

```bash
cd verbaai-backend
npm install

cd ../verbaai-frontend
npm install
```

> **Note:** if you unzip this on a different machine/OS than it was built on,
> always run `npm install` fresh rather than copying `node_modules` over —
> several packages here (rolldown/vite, `@napi-rs/canvas` used by pdf-parse)
> ship OS-specific native binaries.

## 3. Configure environment variables

`verbaai-backend/.env` already exists with sane local defaults. At minimum
double check/set:

```
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/verbaai
JWT_SECRET=change_me
REFRESH_TOKEN_SECRET=change_me_too
OPENAI_API_KEY=sk-...      # only needed for AI features
```

`verbaai-frontend/.env` already points at the backend correctly:
```
VITE_API_URL=http://localhost:5001/api
```

## 4. Run both servers

**Terminal 1 — backend:**
```bash
cd verbaai-backend
npm run dev
```
You should see `✅ MongoDB Connected Successfully` and `🚀 Server Running` on port 5001.

**Terminal 2 — frontend:**
```bash
cd verbaai-frontend
npm run dev
```
Vite will print a local URL, normally `http://localhost:5173`. Open that in
your browser.

The frontend is hardcoded (via CORS in `app.js` and `VITE_API_URL`) to talk to
the backend on `localhost:5173` ↔ `localhost:5001`, so as long as you don't
change those ports you don't need to touch any config.

### Optional: one command for both
If you'd like a single `npm run dev` at the root that starts both, install
`concurrently` at the root and add a script — ask me and I'll wire it up.

---

## What was fixed

The project didn't build/run cleanly. Here's everything that was wrong and
what changed:

### Backend
- **`app.js`**: `authRoutes` was mounted a second time *after* the error
  middleware — Express requires error middleware to be the very last thing
  registered, so any error thrown inside that duplicate route block would
  have skipped your error handler entirely and just crashed/hung the
  request. Removed the duplicate mount (routes are already correctly wired
  via `routes/index.js`) and moved `errorMiddleware` to the end.
- **`app.js`**: the `rateLimiter` middleware existed but was never applied
  anywhere. It's now wired onto `/api`.
- **`models/User.js`**: register/login responses were leaking the bcrypt
  password hash to the client (`User.create()`/`findOne()` results were sent
  back as-is with no `.select('-password')`). Added a `toJSON` transform on
  the schema so the password field is stripped from **every** JSON response
  automatically, regardless of which controller forgets to exclude it.
- **`services/pdf.service.js`**: `pdf-parse` was imported at the top of the
  file, which pulls in `pdfjs-dist` → `@napi-rs/canvas`. In this sandbox the
  installed native binary was for macOS ARM, so loading it **crashed the
  entire server on startup**, not just resume analysis. Changed to a dynamic
  `import()` inside the function so a native-binding failure only breaks the
  resume-upload feature instead of taking down the whole API. (On your own
  machine, once you run `npm install` for your OS, this should just work.)
- **Missing `.gitignore`**: the backend had none at all, meaning
  `node_modules`, your `.env` (with secrets), and uploaded resumes could get
  committed to git. Added one.

### Frontend — these were the ones actually breaking login/signup/admin
- **`lib/api.ts`**: every backend response is wrapped like
  `{ success, statusCode, message, data }`, but every frontend service was
  doing `return response.data`, i.e. returning the *whole wrapper* instead of
  the actual payload. This silently broke:
  - **Login**: `response.data.accessToken` was always `undefined`, so the
    JWT was never saved to `localStorage`. Users appeared to "log in"
    successfully but every subsequent authenticated request 401'd and
    bounced them back to `/login`.
  - **Register**: same issue — `response.user` was always `undefined`, so
    the app never set the logged-in user after signup and immediately
    redirected back to login.
  - **Admin dashboard/users/analytics**: same issue — `stats.totalUsers`
    etc. were reading off the wrapper object instead of the real stats.

  Fixed at the root, once, with a response interceptor in `lib/api.ts` that
  unwraps `response.data.data` automatically for every request. All the
  individual services (`auth.service.ts`, `admin.service.ts`,
  `dashboard.service.ts`, `interview.service.ts`) now get the real data
  without needing individual changes.
- **`auth.service.ts`**: `register()` didn't store the access token at all
  (unlike `login()`), so even once the unwrapping was fixed, a freshly
  registered user still wasn't authenticated. Now stores it the same way
  login does.
- **`services/admin/admin.service.ts`**:
  - Imported `../lib/api`, which doesn't exist from that file's location
    (`src/services/admin/`) — fixed to `../../lib/api`.
  - Was missing the `AdminDashboardStats` and `AdminUser` types and the
    `getInterviews()` method that other admin components already imported
    and called — added all three.
- **`components/admin/AnalyticsChart.tsx`**: imported the admin service from
  the wrong relative depth (`../../../services/...` instead of
  `../../services/...`) — fixed.
- **`pages/admin/AdminDashboard.tsx`**: imported a non-existent
  `../services/admin.service` (unused/dead import) and never imported
  `AdminSidebar` even though it renders `<AdminSidebar />` — both fixed.
- **`types/interview.typess.ts`** → renamed to **`interview.types.ts`**
  (typo'd filename didn't match the import used in
  `pages/admin/Interviews.tsx`, which was importing a file that didn't
  exist). Also added the `overallScore` field the admin Interviews table
  reads, which was missing from the type.

After these fixes, `npx tsc -b --noEmit` and the app compile with **zero
errors** (previously there were 11 TypeScript errors that would have made
`npm run build` fail outright).

### Known gaps (not breaking, but incomplete — worth knowing about)
- `Login.tsx` links to `/forgot-password`, but there's no route or page for
  it in `App.tsx`. Clicking it currently 404s (client-side "no matching
  route"). Either add a page or remove the link — happy to build the page if
  you want it.
- `dashboard.service.ts` has methods for `/dashboard/weekly-progress`,
  `/dashboard/statistics`, `/dashboard/recent-interviews`, and
  `/dashboard/today-challenge`, but the backend only implements a single
  `GET /dashboard` route. These frontend methods aren't currently called
  anywhere (the `Dashboard` page is still all static placeholder numbers
  like `"48"`, `"88%"`), so nothing is broken today — but if you wire the
  dashboard up to real data, you'll want to either add those backend routes
  or point the frontend at the one route that exists.
- The backend never sets an `accessToken` cookie, even though
  `auth.middleware.js` and `cookie-parser` support reading one as a
  fallback. Not broken (Bearer-token auth works fine on its own), just dead
  code — fine to leave as-is or wire up if you want cookie-based auth too.
