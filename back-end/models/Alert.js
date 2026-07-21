import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["Emergency", "Camp", "System"],
      required: true,
    },
    blood: { type: String, required: true }, // e.g., "O+", "A-", "All"
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Active", "Scheduled", "Completed"],
      default: "Active",
    },
    date: { type: String, required: true }, // e.g., "10 May 2026"
    time: { type: String, required: true }, // e.g., "10:30 AM"
    peopleNotifiedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Alert", alertSchema);
