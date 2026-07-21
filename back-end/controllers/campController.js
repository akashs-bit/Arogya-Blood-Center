import Camp from "../models/Camp.js";
import CampRegistration from "../models/CampRegistration.js";

// ======================================
// ADMIN CREATE CAMP
// ======================================

export const createCamp = async (req, res) => {
  try {
    const { campName, campLocation, campDate, campTime, totalSlots } = req.body;

    // VALIDATION

    if (!campName || !campLocation || !campDate || !campTime) {
      return res.status(400).json({
        success: false,
        message: "Camp name, location, date, and time are required",
      });
    }

    // CREATE CAMP

    const camp = await Camp.create({
      campName: campName.trim(),

      campLocation: campLocation.trim(),

      campDate,

      campTime: campTime.trim(),

      totalSlots: totalSlots || 150,
    });

    return res.status(201).json({
      success: true,

      message: "Camp created successfully",

      camp,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================
// USER GET ALL CAMPS
// ======================================

export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find({
      isActive: true,
    })
      .sort({
        campDate: 1,
      })
      .lean();

    const updatedCamps = camps.map((camp) => ({
      _id: camp._id,

      campName: camp.campName,

      campLocation: camp.campLocation,

      campDate: camp.campDate,

      campTime: camp.campTime,

      registered: camp.registeredCount,

      totalSlots: camp.totalSlots,
    }));

    return res.status(200).json({
      success: true,

      camps: updatedCamps,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================
// USER REGISTER CAMP
// ======================================

export const registerCamp = async (req, res) => {
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

    // VALIDATION

    if (!campId || !fullName || !phone || !email) {
      return res.status(400).json({
        success: false,

        message: "Camp, full name, phone, and email are required",
      });
    }

    // FIND CAMP

    const camp = await Camp.findById(campId);

    if (!camp || !camp.isActive) {
      return res.status(404).json({
        success: false,

        message: "Camp not found",
      });
    }

    // CHECK DUPLICATE

    const existingRegistration = await CampRegistration.findOne({
      campId,

      user: req.user._id,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,

        message: "You are already registered for this camp",
      });
    }

    // CAMP FULL CHECK

    if (camp.registeredCount >= camp.totalSlots) {
      return res.status(400).json({
        success: false,

        message: "This camp is already full",
      });
    }

    // CREATE REGISTRATION

    await CampRegistration.create({
      user: req.user._id,

      campId: camp._id,

      fullName: fullName.trim(),

      phone: phone.trim(),

      email: email.trim().toLowerCase(),

      dateOfBirth: dateOfBirth || null,

      bloodGroup: bloodGroup || null,

      weight: weight || null,

      preferredSlot: preferredSlot || "",

      lastDonationDate: lastDonationDate || null,

      address: address || "",

      medicalInfo: medicalInfo || "",

      campName: camp.campName,

      campLocation: camp.campLocation,

      campDate: camp.campDate,

      campTime: camp.campTime,
    });

    // UPDATE REGISTERED COUNT

    camp.registeredCount += 1;

    await camp.save();

    return res.status(201).json({
      success: true,

      message: "Camp registration successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================
// USER MY REGISTRATIONS
// ======================================

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await CampRegistration.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      registrations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================
// ADMIN GET ALL REGISTRATIONS
// ======================================

export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await CampRegistration.find()
      .populate("user", "fullName phone email bloodGroup")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      registrations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================
// ADMIN UPDATE CAMP
// ======================================

export const updateCamp = async (req, res) => {
  try {
    const { id } = req.params;

    const { campName, campLocation, campDate, campTime, totalSlots, isActive } =
      req.body;

    const camp = await Camp.findById(id);

    if (!camp) {
      return res.status(404).json({
        success: false,

        message: "Camp not found",
      });
    }

    camp.campName = campName?.trim() || camp.campName;

    camp.campLocation = campLocation?.trim() || camp.campLocation;

    camp.campDate = campDate || camp.campDate;

    camp.campTime = campTime || camp.campTime;

    camp.totalSlots = Number(totalSlots) || camp.totalSlots;

    camp.isActive = typeof isActive === "boolean" ? isActive : camp.isActive;

    await camp.save();

    return res.status(200).json({
      success: true,

      message: "Camp updated successfully",

      camp,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};


// ======================================
// ADMIN DELETE CAMP
// ======================================

export const deleteCamp = async (req, res) => {
  try {
    const { id } = req.params;

    const camp = await Camp.findById(id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    // DELETE ALL REGISTRATIONS

    await CampRegistration.deleteMany({
      campId: camp._id,
    });

    // DELETE CAMP

    await Camp.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Camp deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
