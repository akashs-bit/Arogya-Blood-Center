import mongoose from "mongoose";

const campRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    bloodGroup: {
      type: String,
      required: true,
      trim: true,
    },

    weight: {
      type: Number,
      default: null,
    },

    // 👑 FIXED: Removed the rigid enum so string formats like "02:00 PM - 03:00 PM" register perfectly
    preferredSlot: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },

    // ✨ ADDED: Tracking field to safely lock continuous reminders for 4 hours and avoid spamming
    lastReminderSentAt: {
      type: Date,
      default: null,
    },

    lastDonationDate: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    medicalInfo: {
      type: String,
      default: "",
      trim: true,
    },

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

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

campRegistrationSchema.index({ campId: 1, user: 1 }, { unique: true });
campRegistrationSchema.index({ campId: 1, phone: 1 }, { unique: true });
campRegistrationSchema.index({ campId: 1, email: 1 }, { unique: true });

const CampRegistration = mongoose.model(
  "CampRegistration",
  campRegistrationSchema,
);

export default CampRegistration;
