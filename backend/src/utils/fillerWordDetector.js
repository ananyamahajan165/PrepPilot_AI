// Deterministic filler-word detection — counted programmatically rather
// than left to the LLM, so the number shown to the student (and stored in
// MongoDB) is exact and reproducible, not an AI estimate. The detected list
// is also fed back into the Gemini prompt so its coaching advice ("how to
// reduce them") references the same words the student actually said.
const FILLER_TERMS = [
  "um", "umm", "ummm", "uh", "uhh", "er", "erm",
  "like", "actually", "basically", "literally",
  "you know", "i mean", "sort of", "kind of", "kinda", "sorta",
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns { fillerWordCount, fillerWordsFound } where fillerWordsFound is
 * the list of distinct filler terms actually present (each listed once),
 * and fillerWordCount is the total number of occurrences across all of them.
 */
function detectFillerWords(transcript) {
  const found = [];
  let totalCount = 0;

  for (const term of FILLER_TERMS) {
    const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    const matches = transcript.match(pattern);
    if (matches && matches.length > 0) {
      found.push(term);
      totalCount += matches.length;
    }
  }

  return { fillerWordCount: totalCount, fillerWordsFound: found };
}

module.exports = { detectFillerWords };
