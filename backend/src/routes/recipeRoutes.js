const express = require("express");
const { body } = require("express-validator");
const {
  getRecipes,
  searchRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const router = express.Router();

// GET /api/recipes/search?q= (must be defined before /:id)
router.get("/search", searchRecipes);

// GET /api/recipes
router.get("/", getRecipes);

// GET /api/recipes/:id
router.get("/:id", getRecipeById);

// POST /api/recipes (authenticated)
router.post(
  "/",
  authMiddleware,
  [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("instructions").trim().notEmpty().withMessage("Instructions are required."),
    body("cookingTime")
      .isInt({ min: 1 })
      .withMessage("Cooking time must be a positive number (minutes)."),
    body("calories")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Calories cannot be negative."),
  ],
  validate,
  createRecipe
);

// PUT /api/recipes/:id (authenticated, owner only)
router.put("/:id", authMiddleware, updateRecipe);

// DELETE /api/recipes/:id (authenticated, owner only)
router.delete("/:id", authMiddleware, deleteRecipe);

module.exports = router;
