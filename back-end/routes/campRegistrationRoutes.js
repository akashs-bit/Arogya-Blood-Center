import express from "express";
import {
  getAllCamps,
  getAllRegistrations,
  getMyRegistrations,
  registerCamp,
} from "../controllers/campRegistrationController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER REGISTER CAMP

router.post("/register-camp", protect, registerCamp);

// USER REGISTRATIONS

router.get("/my-registrations", protect, getMyRegistrations);

// Camps counts
router.get("/all", getAllCamps);

// ADMIN GET ALL

router.get(
  "/all-registrations",
  protect,
  authorizeRoles("admin"),
  getAllRegistrations,
);

export default router;
