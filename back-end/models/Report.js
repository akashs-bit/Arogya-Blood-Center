import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Donations", "Blood Stock", "Emergency", "Camps"],
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Generated", "Pending"],
      default: "Generated",
    },
    downloadUrl: {
      type: String,
      default: "#",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema);
