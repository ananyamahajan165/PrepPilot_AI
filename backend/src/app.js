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
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  success(res, 200, { status: "ok" }, "PrepPilot AI backend is running");
});

app.use("/api", apiLimiter);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/communication", require("./routes/communicationRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

app.use((req, res) => {
  error(res, 404, "Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof AllGeminiKeysExhaustedError) {
    return error(res, 503, err.message);
  }

  const statusCode = err.statusCode || err.status || 500;

  const isClientError = statusCode >= 400 && statusCode < 500;
  const message = isClientError ? err.message || "Bad request" : "Internal server error";

  error(res, statusCode, message);
});

module.exports = app;
