const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    password: {
      type: String,
      required: function () {
        return this.provider !== "google";
      },
      select: false,
    },
    provider: { type: String, enum: ["local", "google"], default: "local" },

    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    college: { type: String, default: "", trim: true },
    branch: { type: String, default: "", trim: true },
    skills: { type: [String], default: [] },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },

    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
