require("dotenv").config();

const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors");
const errorHandler = require("./middlewares/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const tagRoutes = require("./routes/tagRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// MIDDLEWARE
// ========================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// ROUTES
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ========================
// ERROR HANDLING
// ========================
app.use(errorHandler);

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
