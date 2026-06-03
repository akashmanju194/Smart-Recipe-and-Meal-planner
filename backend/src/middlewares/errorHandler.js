/**
 * Global error handling middleware.
 * Catches errors thrown by controllers and sends a formatted JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error(err.stack);

  // Prisma known request errors
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({
      error: `A record with this ${field} already exists.`,
    });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found.",
    });
  }

  // Validation errors from express-validator
  if (err.type === "validation") {
    return res.status(400).json({
      error: "Validation failed.",
      details: err.errors,
    });
  }

  // Default 500
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error.",
  });
};

module.exports = errorHandler;
