import express from "express";
import {
  createAlert,
  getAllAlerts,
  getAlertStats,
  updateAlert,
  deleteAlert,
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/", createAlert); // Triggered by handleCreateAlert form submit
router.get("/", getAllAlerts); // Feeds the table grid data
router.get("/stats", getAlertStats); // Feeds the upper metric grid summary counters

// ✨ New Action Routes
router.put("/:id", updateAlert); // For Editing
router.delete("/:id", deleteAlert); // For Deleting

export default router;
