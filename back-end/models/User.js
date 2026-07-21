import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: null,
    },

    weight: {
      type: Number,
      min: 0,
      default: null,
    },

    lastDonationDate: {
      type: Date,
      default: null,
    },

    donorType: {
      type: String,
      enum: ["Voluntary Donor", "Replacement Donor", "Rare Group Donor"],
      default: "Voluntary Donor",
    },

    emergencyAvailability: {
      type: String,
      enum: ["Available Anytime", "Available On Call", "Not Available"],
      default: "Available Anytime",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isEligible: {
      type: Boolean,
      default: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
