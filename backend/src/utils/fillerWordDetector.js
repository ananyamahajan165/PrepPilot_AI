

const FILLER_TERMS = [
  "um", "umm", "ummm", "uh", "uhh", "er", "erm",
  "like", "actually", "basically", "literally",
  "you know", "i mean", "sort of", "kind of", "kinda", "sorta",
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
