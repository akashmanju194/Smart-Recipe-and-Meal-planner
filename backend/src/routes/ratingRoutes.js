const express = require("express");
const { body } = require("express-validator");
const { submitRating, getRecipeRatings } = require("../controllers/ratingController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const router = express.Router();

// POST /api/ratings/:recipeId (authenticated)
router.post(
  "/:recipeId",
  authMiddleware,
  [
    body("tasteScore")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Taste score must be between 1 and 5."),
    body("healthScore")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Health score must be between 1 and 5."),
    body("overallScore")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Overall score must be between 1 and 5."),
  ],
  validate,
  submitRating
);

// GET /api/ratings/:recipeId
router.get("/:recipeId", getRecipeRatings);

module.exports = router;
