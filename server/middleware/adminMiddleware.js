// server/middleware/adminMiddleware.js
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }

  
  console.warn(
    `⛔ Admin access denied — user: ${req.user?._id || "unknown"}, role: ${req.user?.role || "none"}`
  );

  res.status(403).json({ message: "Access denied. Admins only." });
};

export default adminOnly;