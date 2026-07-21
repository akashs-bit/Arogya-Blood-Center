import {
  createDonor,
  deleteDonor,
  getAllDonors,
  getDonorById,
  searchDonors,
  updateDonor,
} from "../controllers/donorController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

// SEARCH DONORS

router.get("/search", searchDonors);

// ADMIN GET DONORS

router.get("/all", protect, authorizeRoles("admin"), getAllDonors);
router.post("/create", protect, authorizeRoles("admin"), createDonor);
router.put("/update/:id", protect, authorizeRoles("admin"), updateDonor);
router.get("/:id", protect, authorizeRoles("admin"), getDonorById);
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteDonor);

export default router;
