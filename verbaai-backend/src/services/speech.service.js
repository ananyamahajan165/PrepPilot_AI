class SpeechService {
  analyzeSpeech(transcript) {
    const words = transcript.trim().split(/\s+/);

    const wordCount = words.length;

    const fillerWords = [
      "um",
      "uh",
      "like",
      "actually",
      "basically",
      "you know",
    ];

    let fillers = 0;

    fillerWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const matches = transcript.match(regex);

      if (matches) {
        fillers += matches.length;
      }
    });

    const confidence = Math.max(
      100 - fillers * 5,
      40
    );

    const fluency = Math.min(
      wordCount,
      100
    );

    return {
      wordCount,
      fillerWords: fillers,
      confidence,
      fluency,
    };
  }
}

export default new SpeechService();