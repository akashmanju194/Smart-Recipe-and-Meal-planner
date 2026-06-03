const prisma = require("../config/db");

/**
 * POST /api/ratings/:recipeId
 * Submit a rating for a recipe (one per user per recipe).
 */
const submitRating = async (req, res, next) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const { tasteScore, healthScore, overallScore } = req.body;

    // Validate score ranges (1-5)
    for (const [name, score] of Object.entries({ tasteScore, healthScore, overallScore })) {
      if (score < 1 || score > 5) {
        return res.status(400).json({ error: `${name} must be between 1 and 5.` });
      }
    }

    // Check recipe exists
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    // Create rating
    const rating = await prisma.rating.create({
      data: {
        userId: req.user.id,
        recipeId,
        tasteScore: parseFloat(tasteScore),
        healthScore: parseFloat(healthScore),
        overallScore: parseFloat(overallScore),
      },
      include: {
        user: { select: { id: true, name: true, username: true } },
      },
    });

    res.status(201).json(rating);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "You have already rated this recipe." });
    }
    next(err);
  }
};

/**
 * GET /api/ratings/:recipeId
 * Get all ratings for a recipe with average scores.
 */
const getRecipeRatings = async (req, res, next) => {
  try {
    const recipeId = parseInt(req.params.recipeId);

    const [ratings, aggregation] = await Promise.all([
      prisma.rating.findMany({
        where: { recipeId },
        include: {
          user: { select: { id: true, name: true, username: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rating.aggregate({
        where: { recipeId },
        _avg: { tasteScore: true, healthScore: true, overallScore: true },
        _count: true,
      }),
    ]);

    res.json({
      ratings,
      averages: aggregation._avg,
      totalRatings: aggregation._count,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitRating, getRecipeRatings };
