const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

/**
 * POST /api/auth/register
 * Create a new user account.
 */
const register = async (req, res, next) => {
  try {
    const { name, username, email, password, profileBio, profilePicUrl } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        profileBio: profileBio || null,
        profilePicUrl: profilePicUrl || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profileBio: true,
        profilePicUrl: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profileBio: user.profileBio,
        profilePicUrl: user.profilePicUrl,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user's profile.
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profileBio: true,
        profilePicUrl: true,
        createdAt: true,
        _count: { select: { recipes: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
