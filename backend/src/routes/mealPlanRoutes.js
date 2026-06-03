const express = require("express");
const { body } = require("express-validator");
const {
  getMealPlans,
  createMealPlan,
  addMealPlanItem,
  removeMealPlanItem,
} = require("../controllers/mealPlanController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const router = express.Router();

// All meal plan routes require authentication
router.use(authMiddleware);

// GET /api/meal-plans
router.get("/", getMealPlans);

// POST /api/meal-plans
router.post(
  "/",
  [body("date").notEmpty().withMessage("Date is required.")],
  validate,
  createMealPlan
);

// POST /api/meal-plans/:id/items
router.post(
  "/:id/items",
  [
    body("recipeId").isInt().withMessage("Recipe ID is required."),
    body("mealType")
      .isIn(["Breakfast", "Lunch", "Dinner"])
      .withMessage("Meal type must be Breakfast, Lunch, or Dinner."),
  ],
  validate,
  addMealPlanItem
);

// DELETE /api/meal-plans/:id/items/:itemId
router.delete("/:id/items/:itemId", removeMealPlanItem);

module.exports = router;
