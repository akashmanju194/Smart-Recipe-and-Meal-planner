const express = require("express");
const prisma = require("../config/db");

const router = express.Router();

// GET /api/users/:username — get public profile + their recipes
router.get("/:username", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true,
        name: true,
        username: true,
        profileBio: true,
        profilePicUrl: true,
        createdAt: true,
        _count: { select: { recipes: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const recipes = await prisma.recipe.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, profilePicUrl: true } },
        tasteTags: { include: { taste: true } },
        dietaryTags: { include: { tag: true } },
        _count: { select: { ratings: true } },
      },
    });

    res.json({ user, recipes });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
