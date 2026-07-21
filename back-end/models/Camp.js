import mongoose from "mongoose";

const campSchema = new mongoose.Schema(
  {
    campName: {
      type: String,
      required: true,
      trim: true,
    },

    campLocation: {
      type: String,
      required: true,
      trim: true,
    },

    campDate: {
      type: Date,
      required: true,
    },

    campTime: {
      type: String,
      required: true,
      trim: true,
    },

    totalSlots: {
      type: Number,
      required: true,
      default: 150,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Camp = mongoose.model("Camp", campSchema);

export default Camp;
