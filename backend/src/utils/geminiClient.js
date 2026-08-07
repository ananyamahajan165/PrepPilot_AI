const { GoogleGenAI } = require("@google/genai");

/**
 * Shared Gemini service — the ONLY place in the backend that talks to the
 * Gemini API. Every AI feature (Communication Coach, Interview Practice,
 * Resume Analyzer, MCQ Generator, Topic Generator, ATS Analyzer, and any
 * future feature) must import askGeminiJSON from here rather than creating
 * its own client. That's what makes the multi-key rotation below actually
 * effective — if a controller instantiated its own GoogleGenAI client, it
 * would bypass failover entirely.
 *
 * Key rotation: reads GEMINI_API_KEY_1..GEMINI_API_KEY_5, plus the legacy
 * GEMINI_API_KEY and optional comma-separated GEMINI_API_KEYS. It skips
 * empty values, removes duplicates, round-robins the *starting* key across
 * separate requests so load spreads evenly, and on a rate-limit/auth failure,
 * retries the same request against the next available key before giving up.
 * Raising the numbered limit past 5 keys later is a one-line change (see
 * MAX_KEY_SLOTS below) — no other code needs to change.
 */

const MAX_KEY_SLOTS = 5; // bump this (and add more GEMINI_API_KEY_N vars) to scale past 5 keys

function addKey(keys, key) {
  if (typeof key !== "string") return;
  const trimmed = key.trim();
  if (trimmed.length > 0 && !keys.includes(trimmed)) {
    keys.push(trimmed);
  }
}

function readGeminiApiKeys(env = process.env) {
  const keys = [];

  // Keep older local .env files working: GEMINI_API_KEY becomes the first key.
  addKey(keys, env.GEMINI_API_KEY);

  for (let i = 1; i <= MAX_KEY_SLOTS; i++) {
    addKey(keys, env[`GEMINI_API_KEY_${i}`]);
  }

  if (typeof env.GEMINI_API_KEYS === "string") {
    env.GEMINI_API_KEYS.split(",").forEach((key) => addKey(keys, key));
  }

  return keys;
}

const API_KEYS = readGeminiApiKeys();

if (API_KEYS.length === 0) {
  // Fails loudly at startup rather than on the first AI request — a config
  // problem should surface immediately, not three days later on `/analyze`.
  console.error(
    "[gemini] No Gemini API keys found. Set GEMINI_API_KEY_1 (and optionally _2 through _5), GEMINI_API_KEYS, or GEMINI_API_KEY in your .env."
  );
}

// One cached GoogleGenAI client per key, created lazily on first use —
// avoids reconstructing a client on every single request.
const clientCache = new Map();
function getClientForKey(key) {
  if (!clientCache.has(key)) {
    clientCache.set(key, new GoogleGenAI({ apiKey: key }));
  }
  return clientCache.get(key);
}

// Shared round-robin cursor. Plain module-level counter is fine here —
// Node's single-threaded event loop means there's no real race condition
// between the read and the increment within one request.
let nextKeyIndex = 0;
function takeNextStartIndex() {
  const index = nextKeyIndex % API_KEYS.length;
  nextKeyIndex = (nextKeyIndex + 1) % API_KEYS.length;
  return index;
}

/** Thrown only when every configured key has been tried and failed.
 * Controllers can check `err instanceof AllGeminiKeysExhaustedError` to
 * return the exact required response shape. */
class AllGeminiKeysExhaustedError extends Error {
  constructor() {
    super("All Gemini API keys are temporarily unavailable.");
    this.name = "AllGeminiKeysExhaustedError";
  }
}

// Status codes that mean "this key is the problem" (rate-limited, invalid,
// unauthorized, quota exhausted) — worth moving to the next key rather than
// failing the whole request immediately.
const RETRYABLE_STATUS_CODES = new Set([429, 401, 403]);

function statusCodeOf(err) {
  return err?.status ?? err?.statusCode ?? err?.response?.status ?? null;
}

function isKeyLevelFailure(err) {
  const status = statusCodeOf(err);
  if (RETRYABLE_STATUS_CODES.has(status)) return true;
  // Some SDK errors surface the reason in the message rather than a clean
  // status code (e.g. wrapped network/auth errors) — fall back to a text
  // match for the common Gemini quota/auth phrases.
  const msg = String(err?.message || "").toUpperCase();
  return msg.includes("RESOURCE_EXHAUSTED") || msg.includes("QUOTA") || msg.includes("API_KEY_INVALID") || msg.includes("PERMISSION_DENIED");
}

/**
 * Sends a prompt to Gemini and expects a strict JSON object back. Tries up
 * to API_KEYS.length keys (starting from the next round-robin slot) before
 * throwing AllGeminiKeysExhaustedError.
 */
async function askGeminiJSON(prompt) {
  if (API_KEYS.length === 0) {
    throw new AllGeminiKeysExhaustedError();
  }

  const startIndex = takeNextStartIndex();
  let lastError = null;

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const keyIndex = (startIndex + attempt) % API_KEYS.length;
    const keyLabel = `key #${keyIndex + 1}/${API_KEYS.length}`; // never log the key value itself

    try {
      console.log(`[gemini] using ${keyLabel}`);
      const ai = getClientForKey(API_KEYS[keyIndex]);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${prompt}\n\nRespond with ONLY a valid JSON object. No markdown, no code fences, no commentary before or after.`,
        config: { responseMimeType: "application/json" },
      });

      const raw = (response.text || "").trim();
      const cleaned = raw.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();

      try {
        return JSON.parse(cleaned);
      } catch (parseErr) {
        // The request itself succeeded — this key is fine. A malformed
        // response is a prompt/formatting issue, not a key problem, so
        // there's no reason to burn through the remaining keys for it.
        throw new Error("Gemini did not return valid JSON: " + raw.slice(0, 200));
      }
    } catch (err) {
      if (err instanceof AllGeminiKeysExhaustedError) throw err;

      if (isKeyLevelFailure(err)) {
        console.warn(`[gemini] ${keyLabel} failed (status ${statusCodeOf(err) ?? "n/a"}) — trying next key`);
        lastError = err;
        continue; // try the next key
      }

      // Not a key-level issue (bad JSON, unexpected SDK error, etc.) —
      // retrying with a different key wouldn't help, so fail fast.
      console.error(`[gemini] ${keyLabel} request failed (non-key error):`, err.message);
      throw err;
    }
  }

  console.error(`[gemini] all ${API_KEYS.length} keys exhausted. Last error: ${lastError?.message}`);
  throw new AllGeminiKeysExhaustedError();
}

module.exports = { askGeminiJSON, AllGeminiKeysExhaustedError };
