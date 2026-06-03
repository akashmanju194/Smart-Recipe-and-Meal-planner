const prisma = require("../config/db");

/**
 * GET /api/recipes
 * List recipes with optional filters: taste, dietaryTag, maxTime, minCalories, maxCalories.
 */
const getRecipes = async (req, res, next) => {
  try {
    const { taste, dietaryTag, maxTime, minCalories, maxCalories, page = 1, limit = 12 } = req.query;

    const where = {};

    if (maxTime) {
      where.cookingTime = { lte: parseInt(maxTime) };
    }
    if (minCalories || maxCalories) {
      where.calories = {};
      if (minCalories) where.calories.gte = parseInt(minCalories);
      if (maxCalories) where.calories.lte = parseInt(maxCalories);
    }
    if (taste) {
      where.tasteTags = {
        some: { taste: { tasteName: { in: taste.split(",") } } },
      };
    }
    if (dietaryTag) {
      where.dietaryTags = {
        some: { tag: { tagName: { in: dietaryTag.split(",") } } },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, username: true, profilePicUrl: true } },
          tasteTags: { include: { taste: true } },
          dietaryTags: { include: { tag: true } },
          _count: { select: { ratings: true } },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    res.json({
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/recipes/search?q=
 * Smart search across title, author username, taste tags, and meal type.
 */
const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { author: { username: { contains: q, mode: "insensitive" } } },
          { author: { name: { contains: q, mode: "insensitive" } } },
          { tasteTags: { some: { taste: { tasteName: { contains: q, mode: "insensitive" } } } } },
          { dietaryTags: { some: { tag: { tagName: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, profilePicUrl: true } },
        tasteTags: { include: { taste: true } },
        dietaryTags: { include: { tag: true } },
        _count: { select: { ratings: true } },
      },
    });

    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/recipes/:id
 * Get a single recipe with full details.
 */
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: { select: { id: true, name: true, username: true, profileBio: true, profilePicUrl: true } },
        ingredients: { include: { ingredient: true } },
        tasteTags: { include: { taste: true } },
        dietaryTags: { include: { tag: true } },
        ratings: {
          include: { user: { select: { id: true, name: true, username: true } } },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    const aggregation = await prisma.rating.aggregate({
      where: { recipeId: recipe.id },
      _avg: { tasteScore: true, healthScore: true, overallScore: true },
      _count: true,
    });

    res.json({
      ...recipe,
      averageRating: aggregation._avg,
      totalRatings: aggregation._count,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/recipes
 * Create a new recipe (authenticated).
 */
const createRecipe = async (req, res, next) => {
  try {
    const { title, instructions, cookingTime, calories, protein, carbs, fats, imageUrl, ingredients, tasteTags, dietaryTags } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        instructions,
        cookingTime: parseInt(cookingTime),
        calories: parseInt(calories) || 0,
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fats: parseInt(fats) || 0,
        imageUrl: imageUrl || null,
        authorId: req.user.id,
        // Connect ingredients
        ingredients: ingredients?.length
          ? {
              create: ingredients.map((ing) => ({
                quantity: ing.quantity,
                ingredient: {
                  connectOrCreate: {
                    where: { name: ing.name },
                    create: { name: ing.name },
                  },
                },
              })),
            }
          : undefined,
        // Connect taste tags
        tasteTags: tasteTags?.length
          ? {
              create: tasteTags.map((id) => ({ tasteId: parseInt(id) })),
            }
          : undefined,
        // Connect dietary tags
        dietaryTags: dietaryTags?.length
          ? {
              create: dietaryTags.map((id) => ({ tagId: parseInt(id) })),
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, username: true } },
        ingredients: { include: { ingredient: true } },
        tasteTags: { include: { taste: true } },
        dietaryTags: { include: { tag: true } },
      },
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/recipes/:id
 * Update own recipe (authenticated).
 */
const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = parseInt(req.params.id);

    // Verify ownership
    const existing = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!existing) return res.status(404).json({ error: "Recipe not found." });
    if (existing.authorId !== req.user.id) {
      return res.status(403).json({ error: "You can only edit your own recipes." });
    }

    const { title, instructions, cookingTime, calories, protein, carbs, fats, imageUrl } = req.body;

    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        ...(title && { title }),
        ...(instructions && { instructions }),
        ...(cookingTime && { cookingTime: parseInt(cookingTime) }),
        ...(calories !== undefined && { calories: parseInt(calories) }),
        ...(protein !== undefined && { protein: parseInt(protein) }),
        ...(carbs !== undefined && { carbs: parseInt(carbs) }),
        ...(fats !== undefined && { fats: parseInt(fats) }),
        ...(imageUrl && { imageUrl }),
      },
      include: {
        author: { select: { id: true, name: true, username: true } },
        ingredients: { include: { ingredient: true } },
        tasteTags: { include: { taste: true } },
        dietaryTags: { include: { tag: true } },
      },
    });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/recipes/:id
 * Delete own recipe (authenticated).
 */
const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = parseInt(req.params.id);

    const existing = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!existing) return res.status(404).json({ error: "Recipe not found." });
    if (existing.authorId !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own recipes." });
    }

    await prisma.recipe.delete({ where: { id: recipeId } });
    res.json({ message: "Recipe deleted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecipes, searchRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
