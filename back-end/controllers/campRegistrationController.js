import mongoose from "mongoose";
import Camp from "../models/Camp.js";
import CampRegistration from "../models/CampRegistration.js";
// ✅ Import BOTH email utilities correctly
import { sendCampEmail } from "../utils/sendEmail.js";

const normalizeText = (value = "") => value.trim();
const normalizePhone = (value = "") => value.trim();
const normalizeEmail = (value = "") => value.trim().toLowerCase();

// ===============================
// REGISTER CAMP
// ===============================
export const registerCamp = async (req, res) => {
  console.log("👉 REGISTER CAMP ROUTE TRIGGERED");
  console.log("📦 Incoming Request Body:", req.body);
  console.log("👤 Logged In User ID:", req.user?.id);

  try {
    const {
      campId,
      fullName,
      phone,
      email,
      dateOfBirth,
      bloodGroup,
      weight,
      preferredSlot,
      lastDonationDate,
      address,
      medicalInfo,
    } = req.body;

    // 1. Validation Checks
    if (!campId || !fullName || !phone || !email || !bloodGroup) {
      console.log("❌ REGISTRATION FAILED: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Camp, full name, phone, email, and blood group are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(campId)) {
      console.log("❌ REGISTRATION FAILED: Invalid Camp ID format");
      return res.status(400).json({
        success: false,
        message: "Invalid camp ID format",
      });
    }

    // 2. Fetch Active Camp
    const camp = await Camp.findOne({
      _id: campId,
      isActive: true,
    });

    if (!camp) {
      console.log(
        `❌ REGISTRATION FAILED: Camp ${campId} not found or inactive`,
      );
      return res.status(404).json({
        success: false,
        message: "Camp not found or is no longer active",
      });
    }

    // 3. Prevent Duplicate Registration
    const existingRegistration = await CampRegistration.findOne({
      user: req.user.id,
      campId: camp._id,
    });

    if (existingRegistration) {
      console.log(
        `❌ REGISTRATION FAILED: User ${req.user.id} is already registered`,
      );
      return res.status(400).json({
        success: false,
        message: "You have already registered for this camp",
      });
    }

    // 4. Slot Availability Check
    if (camp.registeredCount >= camp.totalSlots) {
      console.log("❌ REGISTRATION FAILED: Camp slots are fully booked");
      return res.status(400).json({
        success: false,
        message: "This camp is already full",
      });
    }

    // 5. Create Registration Document
    const registration = await CampRegistration.create({
      user: req.user.id,
      campId: camp._id,
      fullName: normalizeText(fullName),
      phone: normalizePhone(phone),
      email: normalizeEmail(email),
      dateOfBirth: dateOfBirth || null,
      bloodGroup: normalizeText(bloodGroup),
      weight: weight || null,
      preferredSlot: preferredSlot || "",
      lastDonationDate: lastDonationDate || null,
      address: address ? normalizeText(address) : "",
      medicalInfo: medicalInfo ? normalizeText(medicalInfo) : "",
      campName: camp.campName,
      campLocation: camp.campLocation,
      campDate: camp.campDate,
      campTime: camp.campTime,
    });

    // 6. Increment slot counter dynamically
    camp.registeredCount += 1;
    await camp.save();
    console.log(
      "💾 Camp registration record saved and slot counter updated successfully",
    );

    // 7. Trigger instant registration email asynchronously
    sendCampEmail({
      email: registration.email,
      name: registration.fullName,
      campName: camp.campName,
      campLocation: camp.campLocation,
      campDate: camp.campDate,
      campTime: camp.campTime,
      preferredSlot: registration.preferredSlot, // ✨ Bas ye dynamic field jod dena!
    }).catch((err) =>
      console.error("❌ Background Email Dispatch Error:", err),
    );

    return res.status(201).json({
      success: true,
      message: "Camp registration successful",
      registration,
    });
  } catch (error) {
    console.error("❌ CONTROLLER EXCEPTION ERROR IN REGISTER_CAMP:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET MY REGISTRATIONS (USER SIDE)
// ===============================
export const getMyRegistrations = async (req, res) => {
  console.log(`🔍 Fetching registrations for user: ${req.user.id}`);
  try {
    const registrations = await CampRegistration.find({
      user: req.user.id,
    })
      .populate("campId", "campName campLocation campDate campTime totalSlots")
      .sort({ createdAt: -1 })
      .lean(); // .lean() converts Mongoose docs to plain JS objects so we can add properties easily

    const now = new Date();

    // Dynamically append status (Completed or Upcoming) based on current time
    const updatedRegistrations = registrations.map((reg) => {
      const isCompleted = new Date(reg.campDate) < now;
      return {
        ...reg,
        status: isCompleted ? "Completed" : "Upcoming",
      };
    });

    return res.status(200).json({
      success: true,
      registrations: updatedRegistrations,
    });
  } catch (error) {
    console.error("❌ ERROR FETCHING USER REGISTRATIONS:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// ADMIN GET ALL REGISTRATIONS
// ===============================
export const getAllRegistrations = async (req, res) => {
  console.log("🔍 ADMIN: Fetching all global camp registrations");
  try {
    const registrations = await CampRegistration.find()
      .populate("user", "fullName phone email bloodGroup")
      .populate("campId", "campName campLocation campDate campTime totalSlots")
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    // Dynamically append status for Admin view dashboard
    const updatedRegistrations = registrations.map((reg) => {
      const isCompleted = new Date(reg.campDate) < now;
      return {
        ...reg,
        status: isCompleted ? "Completed" : "Upcoming",
      };
    });

    return res.status(200).json({
      success: true,
      registrations: updatedRegistrations,
    });
  } catch (error) {
    console.error("❌ ADMIN ERROR FETCHING ALL REGISTRATIONS:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL CAMPS
// ===============================
// ===============================
// GET ALL CAMPS
// ===============================
export const getAllCamps = async (req, res) => {
  try {
    // Force evaluation based on local time boundary midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const camps = await Camp.find({
      isActive: true,
      campDate: { $gte: today }, // Keeps camps whose date is today or in the future
    })
      .sort({ campDate: 1 })
      .lean();

    const updatedCamps = camps.map((camp) => ({
      _id: camp._id,
      campName: camp.campName,
      campLocation: camp.campLocation,
      campDate: camp.campDate,
      campTime: camp.campTime,
      registered: camp.registeredCount || 0,
      totalSlots: camp.totalSlots,
    }));

    return res.status(200).json({
      success: true,
      camps: updatedCamps,
    });
  } catch (error) {
    console.error("❌ ERROR FETCHING ALL CAMPS:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET UPCOMING CAMP NOTIFICATIONS
// ===============================
export const getUpcomingNotifications = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingRegistrations = await CampRegistration.find({
      user: req.user.id,
      campDate: { $gte: today },
    })
      .sort({ campDate: 1 })
      .lean();

    const notifications = upcomingRegistrations.map((reg) => ({
      id: reg._id,
      title: "Upcoming Blood Donation Camp!",
      message: `Reminder: You are registered for "${reg.campName}" at ${reg.campLocation}.`,
      campDate: reg.campDate,
      campTime: reg.campTime,
      type: "UPCOMING_CAMP",
    }));

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("❌ ERROR FETCHING UPCOMING NOTIFICATIONS:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// CANCEL REGISTRATION
// ===============================
export const cancelRegistration = async (req, res) => {
  console.log(
    `🗑️ Cancellation request received for registration ID: ${req.params.registrationId}`,
  );
  try {
    const { registrationId } = req.params;

    // Find the registration to know which camp it belongs to
    const reg = await CampRegistration.findById(registrationId);
    if (!reg) {
      console.log(
        "❌ CANCELLATION FAILED: Target registration record not found",
      );
      return res.status(404).json({ message: "Registration record not found" });
    }

    // Decrement the counter inside the Camp document safely
    await Camp.findByIdAndUpdate(reg.campId, { $inc: { registeredCount: -1 } });
    console.log(`📉 Slot counter decremented for camp ID: ${reg.campId}`);

    // Delete the registration document
    await CampRegistration.findByIdAndDelete(registrationId);
    console.log("🗑️ Registration document deleted successfully from database");

    return res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    console.error("❌ ERROR EXCEPTION IN CANCEL_REGISTRATION:", error);
    return res.status(500).json({ message: error.message });
  }
};
