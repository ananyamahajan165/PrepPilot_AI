# VerbaAI — Portfolio Description

## One-liner (resume bullet)
**VerbaAI** — a full-stack MERN placement-prep platform with an AI voice/text
communication coach, AI-generated mock interviews, and resume analysis;
built with React, TypeScript, Node/Express, MongoDB, and the Gemini API.

## Short version (project card / portfolio grid)
VerbaAI is a full-stack AI coaching platform that helps students prepare for
job placements. Its flagship feature is a Confidence & Communication Coach
that accepts live voice or text input and scores responses on confidence,
grammar, fluency, and professionalism using Google's Gemini API — plus AI
mock interviews with freshly generated (never hardcoded) questions and a
resume analyzer that returns a real ATS score. Every number on the
dashboard, from learning streaks to weekly improvement trends, is computed
live from MongoDB — nothing is mocked or hardcoded.

## Long version (dedicated project page)

**VerbaAI** is a full-stack MERN application built to solve a real problem:
students preparing for placements typically juggle four or five disconnected
tools — one for grammar, another for mock interviews, another for resume
review, with no unified way to track whether they're actually improving.
VerbaAI puts the whole loop behind one login.

**The flagship feature** is an AI Confidence & Communication Coach that goes
beyond grammar-checking. Users can type a response or speak it live (via the
Web Speech API combined with the MediaRecorder API for a replayable
recording), and Gemini evaluates it as a communication mentor would — scoring
confidence, clarity, professionalism, grammar, vocabulary, and fluency, then
returning specific coaching: what worked, what to improve, a rewritten more
confident version, and a practice exercise. Filler words are detected
deterministically server-side (not left to the LLM), so the count shown to
the student is exact and reproducible.

**Interview Practice** generates fresh questions from Gemini for every
session — nothing is a static question bank — and scores each answer across
five dimensions with a full session-navigation UI (progress dots, timer,
free navigation between questions before submitting).

**Resume Analyzer** extracts text from an uploaded PDF and returns a real
ATS score, a rewritten professional summary, missing keywords, and specific
grammar/formatting/content suggestions — with full report history and a
one-click downloadable report.

**The dashboard** is a genuine command center rather than a static summary:
daily/weekly goals, a learning streak computed from real activity across
three different collections, a rule-based "recommended next practice" card
that reasons over the user's actual stats, a 4-stage learning-path ladder,
and a 14-day progress timeline — every value computed live via MongoDB
aggregation pipelines, including on a brand-new account with zero history.

## Highlights worth calling out
- **Real JWT auth architecture**: short-lived access tokens kept in memory
  (never `localStorage`, so XSS can't steal them) + long-lived refresh
  tokens in an `httpOnly` cookie with single-use rotation and per-session
  hash storage (never raw tokens in the database).
- **AI integration done right**: one shared Gemini wrapper used by every
  feature, careful prompt engineering to keep the coach in-character (a
  mentor, not a grammar tool), and server-side validation of everything the
  model returns.
- **Production-grade backend hygiene**: Helmet, tiered rate limiting,
  express-validator on every mutating route, a centralized error handler
  that never leaks internal error details to clients, and cascading data
  deletion on account removal.
- **Accessible, responsive, animated UI**: React + TypeScript + Tailwind +
  Framer Motion, with real keyboard navigation, labeled form controls, a
  mobile nav on every screen, and skeleton loading states throughout.

## Tech stack tags
`React` `TypeScript` `Node.js` `Express` `MongoDB` `Mongoose` `JWT`
`Google Gemini API` `Tailwind CSS` `Framer Motion` `Vite` `Web Speech API`
`MediaRecorder API` `REST API` `Multer` `PDF parsing`
