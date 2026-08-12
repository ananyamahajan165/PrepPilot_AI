const { validationResult } = require("express-validator");
const { error } = require("../utils/apiResponse");

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return error(res, 400, "Validation failed", { errors });
}

module.exports = validate;
