import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==============================
// REGISTER USER
// ==============================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      weight,
      lastDonationDate,
      donorType,
      emergencyAvailability,
      address,
    } = req.body;

    // VALIDATION

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, email and password are required",
      });
    }

    // NORMALIZE

    const normalizedPhone = phone.replace(/\s+/g, "");

    const normalizedEmail = email.trim().toLowerCase();

    // CHECK USER

    const existingUser = await User.findOne({
      $or: [
        {
          phone: normalizedPhone,
        },

        {
          email: normalizedEmail,
        },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone or email already registered",
      });
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER

    const user = await User.create({
      fullName: fullName.trim(),

      phone: normalizedPhone,

      email: normalizedEmail,

      password: hashedPassword,

      dateOfBirth: dateOfBirth || null,

      gender: gender || null,

      bloodGroup: bloodGroup || null,

      weight: weight || null,

      lastDonationDate: lastDonationDate || null,

      donorType: donorType || "Voluntary Donor",

      emergencyAvailability: emergencyAvailability || "Available Anytime",

      address: address?.trim() || "",
    });

    // TOKEN

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    // RESPONSE

    return res.status(201).json({
      success: true,

      message: "Donor registered successfully",

      token,

      user: {
        _id: user._id,

        fullName: user.fullName,

        phone: user.phone,

        email: user.email,

        role: user.role,

        bloodGroup: user.bloodGroup,
      },
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
// LOGIN USER
// ==============================

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone and password are required",
      });
    }

    const value = identifier.trim();

    const normalizedEmail = value.toLowerCase();

    const normalizedPhone = value.replace(/\s+/g, "");

    const user = await User.findOne({
      $or: [
        {
          email: normalizedEmail,
        },

        {
          phone: normalizedPhone,
        },
      ],
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Your password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        _id: user._id,

        fullName: user.fullName,

        phone: user.phone,

        email: user.email,

        role: user.role,

        bloodGroup: user.bloodGroup,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
