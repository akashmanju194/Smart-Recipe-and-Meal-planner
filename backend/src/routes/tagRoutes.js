const express = require("express");
const prisma = require("../config/db");

const router = express.Router();

// GET /api/tags/taste — list all taste tags
router.get("/taste", async (req, res, next) => {
  try {
    const tags = await prisma.tasteTag.findMany({ orderBy: { tasteName: "asc" } });
    res.json(tags);
  } catch (err) { next(err); }
});

// GET /api/tags/dietary — list all dietary tags
router.get("/dietary", async (req, res, next) => {
  try {
    const tags = await prisma.dietaryTag.findMany({ orderBy: { tagName: "asc" } });
    res.json(tags);
  } catch (err) { next(err); }
});

module.exports = router;
