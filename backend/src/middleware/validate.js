const { validationResult } = require("express-validator");
const { error } = require("../utils/apiResponse");

/**
 * Runs after a chain of express-validator checks (e.g. body("email").isEmail()).
 * If any check failed, responds with a 400 and the list of validation errors.
 * Otherwise calls next() and lets the controller run.
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return error(res, 400, "Validation failed", { errors });
}

module.exports = validate;
