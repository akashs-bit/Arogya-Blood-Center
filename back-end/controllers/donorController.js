import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ==============================
// ADMIN CREATE DONOR
// ==============================

export const createDonor = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      password,
      gender,
      bloodGroup,
      dateOfBirth,
      weight,
      address,
      emergencyAvailability,
      lastDonationDate,
    } = req.body;

    // VALIDATION

    if (!fullName || !phone || !email || !password || !bloodGroup) {
      return res.status(400).json({
        success: false,

        message: "Please fill all required fields",
      });
    }

    // CHECK EXISTING USER

    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already taken",
      });
    }

    const existingPhone = await User.findOne({
      phone,
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already taken",
      });
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE DONOR

    const donor = await User.create({
      fullName,

      phone,

      email: email.toLowerCase(),

      password: hashedPassword,

      gender,

      bloodGroup,

      dateOfBirth,

      weight,

      address,

      emergencyAvailability: emergencyAvailability || "Available Anytime",

      lastDonationDate,

      role: "user",
    });

    return res.status(201).json({
      success: true,

      message: "Donor added successfully",

      donor,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ==============================
// GET ALL DONORS
// ==============================

export const getAllDonors = async (req, res) => {
  try {
    const donors = await User.find({
      role: "user",
    }).sort({
      createdAt: -1,
    });

    const formattedDonors = donors.map((donor, index) => ({
      _id: donor._id,

      id: `D${String(index + 1).padStart(3, "0")}`,

      name: donor.fullName,

      blood: donor.bloodGroup,

      phone: donor.phone,

      email: donor.email,

      city: donor.address || "N/A",

      donations: 0,

      lastDonation: donor.lastDonationDate
        ? new Date(donor.lastDonationDate).toLocaleDateString("en-IN")
        : "Never",

      emergency:
        donor.emergencyAvailability === "Available Anytime"
          ? "Available"
          : "Not Available",

      status: donor.isEligible ? "Eligible" : "Not Eligible",
    }));

    return res.status(200).json({
      success: true,

      total: formattedDonors.length,

      donors: formattedDonors,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const searchDonors = async (req, res) => {
  try {
    const { search, bloodGroup } = req.query;

    // TEMP REMOVE ROLE FILTER

    let query = {};

    // SEARCH

    if (search) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },

        {
          address: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // BLOOD GROUP

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    console.log("QUERY:", query);

    const donors = await User.find(query);

    console.log("DONORS:", donors);

    return res.status(200).json({
      success: true,

      count: donors.length,

      donors,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getDonorById = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      donor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    donor.fullName = req.body.fullName || donor.fullName;

    donor.phone = req.body.phone || donor.phone;

    donor.email = req.body.email || donor.email;

    donor.gender = req.body.gender || donor.gender;

    donor.bloodGroup = req.body.bloodGroup || donor.bloodGroup;

    donor.dateOfBirth = req.body.dateOfBirth || donor.dateOfBirth;

    donor.weight = req.body.weight || donor.weight;

    donor.address = req.body.address || donor.address;

    donor.lastDonationDate =
      req.body.lastDonationDate || donor.lastDonationDate;

    donor.emergencyAvailability =
      req.body.emergencyAvailability || donor.emergencyAvailability;

    await donor.save();

    return res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      donor,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    await donor.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Donor deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
