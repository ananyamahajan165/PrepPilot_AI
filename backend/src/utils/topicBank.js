// Fixed bank of Speaking Practice topics, grouped by difficulty. Like
// interviewCategories.js, this is curated *content* for the topic picker —
// the AI's job is evaluating the user's spoken/typed answer, not inventing
// topics, so topic text itself is deterministic rather than Gemini-generated.
// Each topic carries its own category, a recommended speaking time, and 2-3
// quick tips shown before the user starts answering.

const EASY = [
  { topic: "Self Introduction", category: "Personal", recommendedMinutes: 1, tips: [
    "Start with your name and what you're currently studying or doing.",
    "Mention one thing that makes you memorable.",
    "Keep it under a minute — this is a warm-up, not your life story.",
  ] },
  { topic: "My Strengths", category: "Personal", recommendedMinutes: 1, tips: [
    "Pick 2-3 strengths, not a laundry list.",
    "Back each one with a quick real example.",
    "Tie it to how it helps you in college or work.",
  ] },
  { topic: "My Weaknesses", category: "Personal", recommendedMinutes: 1, tips: [
    "Choose a real weakness, not a disguised strength.",
    "Show what you're actively doing to improve it.",
    "Keep the tone honest, not apologetic.",
  ] },
  { topic: "My Hobbies", category: "Personal", recommendedMinutes: 1, tips: [
    "Pick one or two hobbies you can actually talk about with energy.",
    "Explain why you enjoy it, not just what it is.",
    "A hobby that shows a transferable skill is a bonus.",
  ] },
  { topic: "My Favorite Book", category: "Personal", recommendedMinutes: 1, tips: [
    "Say why it stuck with you, not just the plot.",
    "One specific detail beats a vague summary.",
    "Connect it to something about how you think or work if you can.",
  ] },
  { topic: "My Favorite Project", category: "Personal", recommendedMinutes: 2, tips: [
    "Briefly set up the problem before describing what you built.",
    "Mention your specific contribution, not just the team's.",
    "End with the outcome or what you learned.",
  ] },
  { topic: "My Daily Routine", category: "Personal", recommendedMinutes: 1, tips: [
    "Focus on the parts that show discipline or good habits.",
    "Keep it structured — morning, work/study block, evening.",
    "Skip the minute-by-minute detail; hit the highlights.",
  ] },
  { topic: "Why did you choose Computer Science?", category: "Personal", recommendedMinutes: 1, tips: [
    "A specific moment or trigger is more convincing than 'I always loved computers.'",
    "Mention what keeps you engaged with it now.",
    "Keep it genuine — avoid a rehearsed-sounding answer.",
  ] },
  { topic: "Describe your hometown.", category: "Personal", recommendedMinutes: 1, tips: [
    "Pick 2-3 details that make it distinctive, not a geography lesson.",
    "A personal memory makes it more engaging.",
    "Keep pacing relaxed — this is an easy warm-up topic.",
  ] },
  { topic: "Tell me about your family.", category: "Personal", recommendedMinutes: 1, tips: [
    "Keep it brief and comfortable — a few sentences is plenty.",
    "Mention something that shaped your values or work ethic.",
    "Stay professional in tone even though the topic is personal.",
  ] },
];

const MEDIUM = [
  { topic: "Why should we hire you?", category: "HR Interview", recommendedMinutes: 2, tips: [
    "Match your strengths to what the role actually needs.",
    "Use one concrete example, not just adjectives.",
    "End with confidence, not a hedge.",
  ] },
  { topic: "Tell me about a challenge you solved.", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Use the STAR method: Situation, Task, Action, Result.",
    "Be specific about what YOU did, not just the team.",
    "End with the outcome and what you learned.",
  ] },
  { topic: "Describe a time you failed.", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Pick a real failure with a genuine lesson, not a humble-brag.",
    "Own the mistake directly before explaining what changed.",
    "Finish on how you apply that lesson now.",
  ] },
  { topic: "Explain your final year project.", category: "College Placement", recommendedMinutes: 2, tips: [
    "Lead with the problem it solves, then the approach.",
    "Mention your specific role and one technical decision you made.",
    "Close with impact or results, even if it's a small measurable one.",
  ] },
  { topic: "Leadership", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Use a specific instance where you led, even informally.",
    "Describe how you handled disagreement or motivated others.",
    "Keep the focus on the team's outcome, not just your title.",
  ] },
  { topic: "Teamwork", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Pick an example with a real obstacle, not a smooth ride.",
    "Show your specific contribution to the group.",
    "Mention what you'd do differently next time.",
  ] },
  { topic: "Conflict Resolution", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Describe the disagreement neutrally, without blaming anyone.",
    "Focus on the steps you took to resolve it.",
    "End with the relationship or outcome afterward.",
  ] },
  { topic: "Time Management", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Give a concrete example of juggling competing deadlines.",
    "Mention a specific method or tool you rely on.",
    "Show the result — what got delivered on time because of it.",
  ] },
  { topic: "Current Affairs discussions", category: "Group Discussion", recommendedMinutes: 2, tips: [
    "Pick one current topic and state a clear, balanced stance.",
    "Support it with a fact or example, not just opinion.",
    "Acknowledge a counterpoint before concluding.",
  ] },
  { topic: "Career goals", category: "HR Interview", recommendedMinutes: 2, tips: [
    "Give both a short-term and a rough long-term goal.",
    "Connect the goals to why this role/field makes sense for you.",
    "Avoid sounding like you'll leave for something unrelated soon.",
  ] },
  { topic: "Workplace ethics", category: "HR Interview", recommendedMinutes: 2, tips: [
    "Use a real or hypothetical scenario to ground your answer.",
    "Show you understand why the principle matters, not just the rule.",
    "Keep the tone thoughtful rather than preachy.",
  ] },
  { topic: "Group Discussion: Is remote work here to stay?", category: "Group Discussion", recommendedMinutes: 2, tips: [
    "State your position early and clearly.",
    "Bring one point for and acknowledge one against.",
    "Land on a clear takeaway, not a fence-sit.",
  ] },
  { topic: "Group Discussion: Should college attendance be mandatory?", category: "Group Discussion", recommendedMinutes: 2, tips: [
    "Take a side rather than listing both without a conclusion.",
    "Use a real consequence to support your point.",
    "Keep it respectful of the opposite view.",
  ] },
  { topic: "College Placement: How do you prepare for interviews?", category: "College Placement", recommendedMinutes: 2, tips: [
    "Mention a concrete routine, not just 'I study a lot.'",
    "Reference a specific resource or method that worked for you.",
    "Show how you handle the nerves, not just the content prep.",
  ] },
  { topic: "Describe a time you had to learn something quickly.", category: "Behavioural", recommendedMinutes: 2, tips: [
    "Set up the time pressure clearly at the start.",
    "Explain your specific learning approach.",
    "End with how it paid off.",
  ] },
];

const HARD = [
  { topic: "Explain a DSA concept of your choice.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Pick one concept and go deep rather than skimming several.",
    "Use a small example or use-case to anchor the explanation.",
    "Mention its time/space complexity if relevant.",
  ] },
  { topic: "Explain OOP principles.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Cover encapsulation, inheritance, polymorphism, abstraction briefly each.",
    "Use one real code-style example to ground the explanation.",
    "Connect it to why OOP helps in real projects, not just definitions.",
  ] },
  { topic: "Explain DBMS normalization.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Walk through 1NF, 2NF, 3NF with a simple table example.",
    "Explain the problem normalization actually solves.",
    "Mention a tradeoff (e.g. read performance vs redundancy).",
  ] },
  { topic: "Explain Operating Systems scheduling.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Name at least two scheduling algorithms and how they differ.",
    "Explain the goal (throughput, fairness, latency) each optimizes for.",
    "Use a short example to illustrate one algorithm.",
  ] },
  { topic: "Explain Computer Networks concepts.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Pick a focused concept (e.g. TCP handshake, OSI layers) rather than everything at once.",
    "Explain it step-by-step in the order it happens.",
    "Tie it back to a practical scenario, like loading a webpage.",
  ] },
  { topic: "Explain AI/ML concepts.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Define the concept in plain language before adding jargon.",
    "Use a concrete example (spam detection, recommendations, etc.).",
    "Mention a real limitation or tradeoff, not just the upside.",
  ] },
  { topic: "System Design basics.", category: "System Design", recommendedMinutes: 3, tips: [
    "Start from requirements before jumping to components.",
    "Mention scale considerations (load, storage, latency).",
    "Call out one tradeoff you'd make and why.",
  ] },
  { topic: "Abstract thinking: If you could redesign the internet, what would you change?", category: "Abstract Thinking", recommendedMinutes: 3, tips: [
    "Pick one clear idea rather than a scattered wish list.",
    "Explain the reasoning, not just the change itself.",
    "Acknowledge a tradeoff or downside of your idea.",
  ] },
  { topic: "Business case study: How would you increase user retention for a fitness app?", category: "Business Case Study", recommendedMinutes: 3, tips: [
    "Clarify assumptions about the users first.",
    "Propose 2-3 concrete levers, not just 'add notifications.'",
    "Mention how you'd measure if it worked.",
  ] },
  { topic: "Leadership case study: A teammate keeps missing deadlines — what do you do?", category: "Leadership Case Study", recommendedMinutes: 3, tips: [
    "Address the root cause before jumping to consequences.",
    "Balance empathy with accountability in your approach.",
    "Describe a clear next step, not just a conversation.",
  ] },
  { topic: "Product thinking: How would you improve a food delivery app?", category: "Product Thinking", recommendedMinutes: 3, tips: [
    "Anchor on a specific user problem before proposing features.",
    "Prioritize — mention what you'd build first and why.",
    "Consider a tradeoff, like cost or complexity.",
  ] },
  { topic: "Startup idea: Pitch a business idea in under 3 minutes.", category: "Startup Ideas", recommendedMinutes: 3, tips: [
    "State the problem before the solution.",
    "Explain who the customer is and why they'd pay.",
    "Mention one realistic risk or competitor.",
  ] },
  { topic: "Debate: Is AI a net positive for employment?", category: "Debate", recommendedMinutes: 3, tips: [
    "Pick a clear side and commit to it.",
    "Bring one strong argument and preempt the obvious counter.",
    "Close with a firm, not wishy-washy, conclusion.",
  ] },
  { topic: "Explain a recent technology trend.", category: "Technical Interview", recommendedMinutes: 3, tips: [
    "Explain what the trend actually is before opining on it.",
    "Give a concrete example of it in use.",
    "Share a genuine opinion on where it's headed.",
  ] },
  { topic: "Explain how you would design a URL shortener.", category: "System Design", recommendedMinutes: 3, tips: [
    "Cover the core flow: shortening, storage, redirection.",
    "Mention how you'd handle collisions or scale.",
    "Note one thing you'd add for production readiness (analytics, expiry, etc.).",
  ] },
];

const TOPIC_BANK = { easy: EASY, medium: MEDIUM, hard: HARD };

const DIFFICULTIES = ["easy", "medium", "hard"];

module.exports = { TOPIC_BANK, DIFFICULTIES };
