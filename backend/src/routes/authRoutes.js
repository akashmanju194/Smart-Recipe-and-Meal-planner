const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required.")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

// GET /api/auth/me
router.get("/me", authMiddleware, getMe);

module.exports = router;
