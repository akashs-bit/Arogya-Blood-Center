import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { updateCamp } from "../controllers/campController.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTE
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.put("/:id", protect, authorizeRoles("admin"), updateCamp);

export default router;
