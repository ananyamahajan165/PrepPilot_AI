const { GoogleGenAI } = require("@google/genai");

const MAX_KEY_SLOTS = 5;

function addKey(keys, key) {
  if (typeof key !== "string") return;
  const trimmed = key.trim();
  if (trimmed.length > 0 && !keys.includes(trimmed)) {
    keys.push(trimmed);
  }
}

function readGeminiApiKeys(env = process.env) {
  const keys = [];

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

  console.error(
    "[gemini] No Gemini API keys found. Set GEMINI_API_KEY_1 (and optionally _2 through _5), GEMINI_API_KEYS, or GEMINI_API_KEY in your .env."
  );
}

const clientCache = new Map();
function getClientForKey(key) {
  if (!clientCache.has(key)) {
    clientCache.set(key, new GoogleGenAI({ apiKey: key }));
  }
  return clientCache.get(key);
}

let nextKeyIndex = 0;
function takeNextStartIndex() {
  const index = nextKeyIndex % API_KEYS.length;
  nextKeyIndex = (nextKeyIndex + 1) % API_KEYS.length;
  return index;
}

class AllGeminiKeysExhaustedError extends Error {
  constructor() {
    super("All Gemini API keys are temporarily unavailable.");
    this.name = "AllGeminiKeysExhaustedError";
  }
}

const RETRYABLE_STATUS_CODES = new Set([429, 401, 403]);

function statusCodeOf(err) {
  return err?.status ?? err?.statusCode ?? err?.response?.status ?? null;
}

function isKeyLevelFailure(err) {
  const status = statusCodeOf(err);
  if (RETRYABLE_STATUS_CODES.has(status)) return true;

  const msg = String(err?.message || "").toUpperCase();
  return msg.includes("RESOURCE_EXHAUSTED") || msg.includes("QUOTA") || msg.includes("API_KEY_INVALID") || msg.includes("PERMISSION_DENIED");
}

async function askGeminiJSON(prompt) {
  if (API_KEYS.length === 0) {
    throw new AllGeminiKeysExhaustedError();
  }

  const startIndex = takeNextStartIndex();
  let lastError = null;

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const keyIndex = (startIndex + attempt) % API_KEYS.length;
    const keyLabel = `key #${keyIndex + 1}/${API_KEYS.length}`;

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

        throw new Error("Gemini did not return valid JSON: " + raw.slice(0, 200));
      }
    } catch (err) {
      if (err instanceof AllGeminiKeysExhaustedError) throw err;

      if (isKeyLevelFailure(err)) {
        console.warn(`[gemini] ${keyLabel} failed (status ${statusCodeOf(err) ?? "n/a"}) — trying next key`);
        lastError = err;
        continue;
      }

      console.error(`[gemini] ${keyLabel} request failed (non-key error):`, err.message);
      throw err;
    }
  }

  console.error(`[gemini] all ${API_KEYS.length} keys exhausted. Last error: ${lastError?.message}`);
  throw new AllGeminiKeysExhaustedError();
}

module.exports = { askGeminiJSON, AllGeminiKeysExhaustedError };
