import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ======================================
// PROTECT ROUTES
// ======================================

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(
      "🔑 Extracted Token:",
      token ? "Token Found!" : "No Token Found",
    );

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📦 Decoded JWT Payload Data:", decoded); // <--- Check if 'id' exists here!

    const user = await User.findById(decoded.id).select(
      "-password -otp -otpExpire -otpLastSentAt",
    );

    console.log(
      "👤 Database User Found:",
      user ? user.fullName : "NULL (User Not Found)",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("❌ AUTHMIDDLEWARE ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ======================================
// ROLE AUTHORIZATION
// ======================================

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
