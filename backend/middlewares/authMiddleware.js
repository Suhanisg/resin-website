const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    return res
      .status(401)
      .json({ message: expired ? "Token expired" : "Invalid token" });
  }
};

module.exports = protect;