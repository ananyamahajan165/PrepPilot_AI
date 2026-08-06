const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Only required for local (email/password) accounts — Google accounts
    // authenticate entirely through Google and never have a local password.
    password: {
      type: String,
      required: function () {
        return this.provider !== "google";
      },
      select: false,
    },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    // Google's stable per-account identifier. `sparse: true` is essential
    // here: most users (local signups) will never have this field at all,
    // and a plain unique index would treat every one of those missing
    // values as a duplicate `null`, breaking after the second local signup.
    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    college: { type: String, default: "", trim: true },
    branch: { type: String, default: "", trim: true },
    skills: { type: [String], default: [] },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    // SHA-256 hashes of currently-valid refresh tokens (one per logged-in
    // device/browser). Never store raw refresh tokens — hashing lets us
    // revoke a single session on logout without being able to leak a
    // usable token if the database is ever read. Capped at 5 so a user
    // can't accumulate unlimited sessions.
    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
