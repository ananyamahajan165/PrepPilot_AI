# VerbaAI — Project Explanation for Interviews

Talking points, architecture reasoning, and anticipated questions. The goal
isn't to memorize a script — it's to actually understand *why* each decision
was made well enough to defend it under follow-up questions.

---

## 30-second elevator pitch

"VerbaAI is a full-stack placement-prep platform I built with React,
Node/Express, and MongoDB. The core idea is that students prepping for
interviews usually juggle separate tools for grammar, mock interviews, and
resume review — so I built one platform where all three live behind one
login, with a dashboard that actually tracks real progress across them. The
flagship feature is a communication coach that takes live voice or text
input and uses Google's Gemini API to score things like confidence and
fluency, not just grammar — closer to a mentor than a grammar checker."

---

## Architecture walkthrough (if asked to whiteboard it)

**Backend**: Node/Express, MVC pattern. Routes only handle validation
wiring; controllers only talk to Mongoose models; models only define schema.
Six features (auth, communication, interview, resume, dashboard, profile),
each with its own route/controller/model files. A shared `apiResponse.js`
gives every endpoint the same `{success, ...}` / `{success: false, message}`
envelope, and a shared `geminiClient.js` means every AI feature calls one
`askGeminiJSON()` function instead of duplicating API-call and JSON-parsing
logic three times.

**Frontend**: React + TypeScript + Vite. One `AuthContext` holds the logged-
in user; page-level data (dashboard stats, history lists) is fetched with
plain `useState`/`useEffect` — deliberately no Redux, because nothing in
this app needs cross-cutting global state beyond "who's logged in."

**Database**: MongoDB with four collections — `User`, `CommunicationSession`,
`InterviewSession`, `ResumeReport`. The dashboard's "real command center"
feel comes from Mongoose aggregation pipelines (`$group`, `$dateToString`,
`$avg`) that compute streaks, trends, and a 14-day timeline live on every
request, rather than storing a `stats` document that could go stale.

---

## Decisions I can defend

**"Why MongoDB instead of a SQL database?"**
The core data — a communication session with variable-shape AI feedback
(arrays of tips, nested score objects, optional fields depending on
input type) — maps naturally onto documents rather than a fixed relational
schema. There's also no complex relational querying need (no multi-table
joins with heavy referential constraints); every query is scoped to one
user across a handful of collections, which MongoDB handles well.

**"Why keep the JWT access token in memory instead of localStorage?"**
`localStorage` is readable by any JavaScript on the page — a single XSS bug
anywhere in the app (or a compromised third-party script) could exfiltrate
every user's token. Keeping the access token in memory means a page reload
loses it, so I added a refresh-token flow: a long-lived token in an
`httpOnly` cookie (unreadable by JS at all) that the frontend uses to
silently mint a new access token on load. It's more moving parts, but it's
the actual industry-standard pattern for a reason.

**"Why did you build a custom filler-word detector instead of just asking
Gemini to count them?"**
Determinism. If a student asks "how many filler words did I use," that
number needs to be exact and reproducible — an LLM might count differently
between calls or hallucinate a word that wasn't said. I detect filler words
with a curated regex list server-side (ground truth), and then *feed that
detected list back into the Gemini prompt* so the model's coaching advice
("try replacing 'like' here") is grounded in the same data, not a second,
possibly-inconsistent guess.

**"Why does only part of the app use a dark theme?"**
The brief for the flagship feature specifically asked for dark theme; the
rest of the app wasn't part of that scope. Rather than force a jarring
half-dark-half-light experience under one shared navbar, I gave the
Communication Coach and its history page their own dark navigation shell
(`DarkLayout`) entirely separate from the light `Layout`/`Navbar` used
everywhere else. It's a real architectural boundary, not a compromise — and
it's set up so extending dark mode app-wide later would mean swapping one
shell, not un-tangling mixed styles.

**"How do you keep three different AI features from duplicating code?"**
Every one of them (Communication Coach scoring, Interview question
generation/scoring, Resume analysis) calls the same `askGeminiJSON(prompt)`
helper, which owns the actual API call, the "respond with strict JSON"
instruction, and the response parsing. Each controller's job is just to
write a good prompt and shape the result into its own Mongoose schema. That
also means if I ever swap models or add retry logic, it's a one-file change.

---

## Challenges I ran into (concrete, not generic)

- **Getting Gemini to actually behave like a coach, not a grammar checker.**
  Early prompts produced generic "here are 3 grammar mistakes" output. I
  had to explicitly instruct the model on its *persona* ("you are a
  communication mentor, NOT a grammar tool") and structure the requested
  JSON around coaching concepts (positive feedback, a rewritten confident
  version, a daily challenge) rather than a flat list of corrections — the
  shape of the schema you ask for really does steer the model's tone.
- **Voice recording without losing state on interruption.** Combining the
  Web Speech API (for live transcription) with MediaRecorder (for a
  replayable audio clip) means two independent async systems have to stay
  in sync through pause/resume/stop. I also had to explicitly handle a
  React state closure bug: an `onend` handler on the recognition object was
  checking a stale value of React state instead of a ref, which caused the
  auto-restart logic to silently stop working after the first pause.
- **A subtle security bug in my own error handling.** After centralizing
  error responses to avoid leaking internal error messages to clients, I
  discovered — via actually testing it live — that the fix had a side
  effect: file-upload validation errors (wrong file type, too large) lost
  their specific, safe messages and got masked behind a generic "Internal
  server error" too, since they don't carry an explicit status code by
  default. Fixed by normalizing those errors to a proper 400 at the
  middleware level instead of relying on the generic catch-all.

---

## What I'd do differently at larger scale

- **Move avatar storage to S3/Cloudinary.** Right now avatars are stored as
  base64 strings directly on the User document — fine for a portfolio-scale
  app, but it bloats document size and isn't how you'd do image storage in
  production.
- **Add a queue for AI calls.** Every Gemini call currently happens
  synchronously inside the request/response cycle. At real scale, I'd move
  scoring to a background job (e.g. BullMQ + Redis) and have the frontend
  poll or use a websocket for the result, so a slow AI response doesn't tie
  up an HTTP connection.
- **Cache the interview category list and rate-limit Gemini calls
  per-user**, not just per-IP, to control cost more precisely as usage grows.
- **Add integration tests** — the backend was verified via manual live
  testing during development (booting the real server and firing real HTTP
  requests to check auth, validation, and rate-limiting behavior end-to-end)
  rather than an automated test suite; that's the next investment I'd make
  before calling this production-ready at scale.

---

## Questions I should have good answers ready for

- *"Walk me through what happens when a user submits a Communication Coach
  session, end to end."* → frontend posts transcript + inputMethod →
  `communicationRoutes.js` validates shape → controller runs the
  deterministic filler-word detector → builds a prompt including the
  detected fillers → calls `askGeminiJSON` → merges the result into a
  `CommunicationSession` document → saves to Mongo → returns it → frontend
  renders `ResultsPanel`.
- *"How would you scale the dashboard aggregation if a user had 100,000
  sessions?"* → the aggregation pipelines already run in MongoDB, not in
  JS, so most of the heavy lifting is already server-side; next step would
  be adding indexes on `{user, createdAt}` (already present) and possibly
  a periodic pre-computed rollup document if aggregation latency became a
  real bottleneck.
- *"What happens if Gemini is down or returns malformed JSON?"* → the
  shared client throws, `express-async-errors` catches it, and the
  centralized error handler returns a generic 500 to the client without
  leaking API details — verified this live by testing with a bad API key
  and confirming it fails in ~300ms rather than hanging.
