const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(candidatePassword, storedPassword) {
  if (!candidatePassword || !storedPassword) {
    return false;
  }

  const normalizedCandidate = String(candidatePassword).trim();
  if (!normalizedCandidate) {
    return false;
  }

  if (typeof storedPassword !== "string") {
    return false;
  }

  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(normalizedCandidate, storedPassword);
  }

  return storedPassword === normalizedCandidate;
}

module.exports = { hashPassword, verifyPassword };
