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

    return error(res, 401, "Not authorized, invalid or expired token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return error(res, 401, "Not authorized, user no longer exists");
  }

  req.user = user;
  next();
}

module.exports = protect;
