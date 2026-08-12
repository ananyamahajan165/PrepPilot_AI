const bcrypt = require("bcryptjs");
const User = require("../models/User");
const CommunicationSession = require("../models/CommunicationSession");
const InterviewSession = require("../models/InterviewSession");
const ResumeReport = require("../models/ResumeReport");
const { success, error } = require("../utils/apiResponse");
const { REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH } = require("../utils/cookieConfig");

const COMPLETION_FIELDS = [
  { key: "avatarUrl", label: "Profile photo" },
  { key: "bio", label: "Bio" },
  { key: "college", label: "College" },
  { key: "branch", label: "Branch" },
  { key: "skills", label: "Skills" },
  { key: "github", label: "GitHub link" },
  { key: "linkedin", label: "LinkedIn link" },
];

function isFieldFilled(user, key) {
  const value = user[key];
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

function computeProfileCompletion(user) {
  const missingFields = COMPLETION_FIELDS.filter((f) => !isFieldFilled(user, f.key)).map((f) => f.label);
  const filledCount = COMPLETION_FIELDS.length - missingFields.length;
  const percent = Math.round((filledCount / COMPLETION_FIELDS.length) * 100);
  return { percent, missingFields };
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    college: user.college,
    branch: user.branch,
    skills: user.skills,
    github: user.github,
    linkedin: user.linkedin,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

function normalizeUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

async function getProfile(req, res) {
  return success(res, 200, {
    user: serializeUser(req.user),
    profileCompletion: computeProfileCompletion(req.user),
  });
}

async function updateProfile(req, res) {
  const { name, email, bio, college, branch, skills, github, linkedin } = req.body;
  const user = req.user;

  if (name !== undefined) user.name = name;
  if (email !== undefined) {
    const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (existing) {
      return error(res, 409, "That email is already in use");
    }
    user.email = email.toLowerCase();
  }
  if (bio !== undefined) user.bio = bio;
  if (college !== undefined) user.college = college;
  if (branch !== undefined) user.branch = branch;
  if (skills !== undefined) {

    const list = Array.isArray(skills) ? skills : String(skills).split(",");
    user.skills = [...new Set(list.map((s) => s.trim()).filter(Boolean))];
  }
  if (github !== undefined) user.github = normalizeUrl(github);
  if (linkedin !== undefined) user.linkedin = normalizeUrl(linkedin);

  await user.save();
  return success(res, 200, {
    user: serializeUser(user),
    profileCompletion: computeProfileCompletion(user),
  });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user.password) {
    return error(res, 400, "This account signed up with Google and has no password to change.");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return error(res, 401, "Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return success(res, 200, {}, "Password updated successfully");
}

async function updateAvatar(req, res) {
  const { avatarDataUrl } = req.body;

  req.user.avatarUrl = avatarDataUrl;
  await req.user.save();

  return success(res, 200, {
    avatarUrl: req.user.avatarUrl,
    profileCompletion: computeProfileCompletion(req.user),
  });
}

async function deleteAccount(req, res) {
  const { password } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (user.password) {
    if (!password) {
      return error(res, 400, "Enter your password to confirm account deletion");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 401, "Incorrect password — account not deleted");
    }
  }

  await Promise.all([
    CommunicationSession.deleteMany({ user: user._id }),
    InterviewSession.deleteMany({ user: user._id }),
    ResumeReport.deleteMany({ user: user._id }),
  ]);
  await User.deleteOne({ _id: user._id });

  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  return success(res, 200, {}, "Your account and all associated data have been deleted");
}

module.exports = { getProfile, updateProfile, changePassword, updateAvatar, deleteAccount };