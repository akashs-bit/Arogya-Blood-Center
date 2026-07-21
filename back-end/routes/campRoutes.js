import express from "express";

// Imports from the main camp controller
import {
  createCamp,
  deleteCamp,
  getAllCamps,
  updateCamp,
} from "../controllers/campController.js";

// ✅ FIXED: Import registerCamp and notifications from campRegistrationController.js
import {
  registerCamp,
  getUpcomingNotifications,
  cancelRegistration,
} from "../controllers/campRegistrationController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN CREATE CAMP
router.post("/create", protect, authorizeRoles("admin"), createCamp);

// GET ALL CAMPS
router.get("/all", getAllCamps);

// USER UPCOMING NOTIFICATIONS
router.get("/notifications/upcoming", protect, getUpcomingNotifications);

// USER REGISTER CAMP
// ✅ FIXED: Using the newly imported registerCamp with diagnostic tracking
router.post(
  "/register-camp",
  protect,
  (req, res, next) => {
    console.log(
      "✈️ ROUTE-LEVEL: protect middleware passed successfully! Redirecting to correct controller...",
    );
    next();
  },
  registerCamp,
);

router.delete("/cancel/:registrationId", protect, cancelRegistration);

// ADMIN UPDATE CAMP
router.put("/:id", protect, authorizeRoles("admin"), updateCamp);

// ADMIN DELETE CAMP
router.delete("/:id", protect, authorizeRoles("admin"), deleteCamp);

export default router;
