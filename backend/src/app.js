const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { passport } = require("./config/passport");
require("express-async-errors");

const { apiLimiter } = require("./middleware/rateLimiter");
const { success, error } = require("./utils/apiResponse");
const { AllGeminiKeysExhaustedError } = require("./utils/geminiClient");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
].filter(Boolean);

// --- Core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
    credentials: true, // required so the browser sends/receives the httpOnly refresh cookie
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // populates req.cookies for the refresh-token flow
// Only initializes Passport itself (req.login/req.user support for a single
// request). Deliberately NOT app.use(passport.session()) and no
// express-session middleware — every passport.authenticate() call in this
// app uses { session: false } and issues our own JWT instead, so there's
// no second, parallel session system to keep in sync.
app.use(passport.initialize());

// --- Health check (useful to verify backend is alive) ---
app.get("/api/health", (req, res) => {
  success(res, 200, { status: "ok" }, "VerbaAI backend is running");
});

// --- Rate limit everything under /api ---
app.use("/api", apiLimiter);

// --- Feature routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/communication", require("./routes/communicationRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// --- 404 handler ---
app.use((req, res) => {
  error(res, 404, "Route not found");
});

// --- Centralized error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Every AI feature (Communication Coach, Interview Practice, Resume
  // Analyzer, MCQ Generator, Topic Generator, ATS Analyzer, ...) calls the
  // same shared Gemini service, so catching this one error type here —
  // instead of in every individual controller — is what gives all of them
  // the exact required "all keys unavailable" response for free.
  if (err instanceof AllGeminiKeysExhaustedError) {
    return error(res, 503, err.message);
  }

  const statusCode = err.statusCode || err.status || 500;
  // Only ever show the real error message for genuine 4xx client errors
  // (e.g. body-parser's "malformed JSON" message, which is safe and useful
  // to the client). Any 5xx — an unexpected exception, a DB driver error,
  // a bug — always gets a generic message here; the real detail is already
  // logged above via console.error, never sent over the wire.
  const isClientError = statusCode >= 400 && statusCode < 500;
  const message = isClientError ? err.message || "Bad request" : "Internal server error";

  error(res, statusCode, message);
});

module.exports = app;
