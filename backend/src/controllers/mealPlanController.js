const prisma = require("../config/db");

/**
 * GET /api/meal-plans
 * Get all meal plans for the authenticated user.
 * Optionally filter by date range with ?startDate=&endDate=.
 */
const getMealPlans = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { userId: req.user.id };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        items: {
          include: {
            recipe: {
              select: { id: true, title: true, calories: true, protein: true, carbs: true, fats: true, cookingTime: true, imageUrl: true },
            },
          },
        },
      },
    });

    res.json(mealPlans);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/meal-plans
 * Create a new meal plan for a specific date.
 */
const createMealPlan = async (req, res, next) => {
  try {
    const { date } = req.body;

    const mealPlan = await prisma.mealPlan.create({
      data: {
        date: new Date(date),
        userId: req.user.id,
        totalCalories: 0,
      },
      include: { items: true },
    });

    res.status(201).json(mealPlan);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/meal-plans/:id/items
 * Add a recipe to a meal plan slot.
 */
const addMealPlanItem = async (req, res, next) => {
  try {
    const mealPlanId = parseInt(req.params.id);
    const { recipeId, mealType } = req.body;

    // Verify meal plan ownership
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id: mealPlanId } });
    if (!mealPlan) return res.status(404).json({ error: "Meal plan not found." });
    if (mealPlan.userId !== req.user.id) {
      return res.status(403).json({ error: "You can only modify your own meal plans." });
    }

    // Validate meal type
    const validMealTypes = ["Breakfast", "Lunch", "Dinner"];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({ error: "Meal type must be Breakfast, Lunch, or Dinner." });
    }

    // Add recipe to plan
    const item = await prisma.mealPlanItem.create({
      data: {
        mealPlanId,
        recipeId: parseInt(recipeId),
        mealType,
      },
      include: {
        recipe: { select: { id: true, title: true, calories: true, protein: true, carbs: true, fats: true, cookingTime: true, imageUrl: true } },
      },
    });

    // Recalculate total calories
    const allItems = await prisma.mealPlanItem.findMany({
      where: { mealPlanId },
      include: { recipe: { select: { calories: true } } },
    });
    const totalCalories = allItems.reduce((sum, i) => sum + (i.recipe.calories || 0), 0);

    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: { totalCalories },
    });

    res.status(201).json({ item, totalCalories });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/meal-plans/:id/items/:itemId
 * Remove a recipe from a meal plan.
 */
const removeMealPlanItem = async (req, res, next) => {
  try {
    const mealPlanId = parseInt(req.params.id);
    const itemId = parseInt(req.params.itemId);

    // Verify ownership
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id: mealPlanId } });
    if (!mealPlan) return res.status(404).json({ error: "Meal plan not found." });
    if (mealPlan.userId !== req.user.id) {
      return res.status(403).json({ error: "You can only modify your own meal plans." });
    }

    await prisma.mealPlanItem.delete({ where: { id: itemId } });

    // Recalculate total calories
    const allItems = await prisma.mealPlanItem.findMany({
      where: { mealPlanId },
      include: { recipe: { select: { calories: true } } },
    });
    const totalCalories = allItems.reduce((sum, i) => sum + (i.recipe.calories || 0), 0);

    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: { totalCalories },
    });

    res.json({ message: "Item removed.", totalCalories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMealPlans, createMealPlan, addMealPlanItem, removeMealPlanItem };
