const { validationResult } = require("express-validator");

/**
 * Middleware to check express-validator validation results.
 * Returns 400 with error details if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed.",
      details: errors.array(),
    });
  }
  next();
};

module.exports = validate;
