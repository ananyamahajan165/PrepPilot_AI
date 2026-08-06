const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utils/apiResponse");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, 401, "Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Only a real JWT problem (bad signature, malformed, expired) lands
    // here — this is the client's fault, hence 401.
    return error(res, 401, "Not authorized, invalid or expired token");
  }

  // Deliberately NOT inside the try/catch above: if this throws (e.g. a
  // database connectivity problem), that's a server-side failure, not an
  // invalid-token situation. Letting it propagate (express-async-errors
  // catches it) routes it to the centralized error handler as a proper
  // 500, instead of being mislabeled "invalid or expired token."
  const user = await User.findById(decoded.id);

  if (!user) {
    return error(res, 401, "Not authorized, user no longer exists");
  }

  req.user = user;
  next();
}

module.exports = protect;
