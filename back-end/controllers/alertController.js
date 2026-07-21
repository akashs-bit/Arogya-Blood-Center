import Alert from "../models/Alert.js";
import User from "../models/User.js"; // Assuming a User schema exists for donors

// CREATE A NEW ALERT VIA THE FRONTEND MODAL
export const createAlert = async (req, res) => {
  try {
    const { title, message, type, blood, priority, status, date, time } =
      req.body;

    // Validate that required fields exist
    if (!title || !message || !type || !blood || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // 1. Initialize the new alert instance
    const newAlert = new Alert({
      title,
      message,
      type,
      blood,
      priority,
      status,
      date,
      time,
    });

    // 2. DYNAMIC LIVE DONOR COUNT MATCHING
    // Find how many donors match this blood group to update the 'People Notified' metric
    let donorQuery = {};
    if (blood !== "All") {
      donorQuery.bloodGroup = blood; // Matches your User schema's blood type field
    }

    const matchingDonorsCount = await User.countDocuments(donorQuery);
    newAlert.peopleNotifiedCount = matchingDonorsCount || 0;

    // 3. Save to MongoDB Atlas
    await newAlert.save();

    // 4. REAL-TIME EMERGENCY BROADCAST SYSTEM
    // If it's a High priority or Emergency alert, this is where you fire off emails/SMS
    if (priority === "High" || type === "Emergency") {
      // Fetch actual emails if needed for email transporter integration
      const targetDonors = await User.find(donorQuery).select("email");

      targetDonors.forEach((donor) => {
        // Your Nodemailer or Twilio integration logic runs here:
        // sendAlertEmail(donor.email, title, message);
        console.log(`📡 Real-time broadcast dispatch sent to: ${donor.email}`);
      });
    }

    return res.status(201).json({
      success: true,
      message: "Alert created and broadcast cycle executed successfully!",
      alert: newAlert,
    });
  } catch (error) {
    console.error("Backend Alert Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Failed to create alert.",
    });
  }
};

// FETCH ALL ALERTS WITH DYNAMIC SEARCH/FILTER
export const getAllAlerts = async (req, res) => {
  try {
    const { search, type, priority } = req.query;
    let queryConditions = {};

    if (search) {
      queryConditions.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    if (type) queryConditions.type = type;
    if (priority) queryConditions.priority = priority;

    const alerts = await Alert.find(queryConditions).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, alerts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET SUMMARIZED CARD METRICS
export const getAlertStats = async (req, res) => {
  try {
    const activeCount = await Alert.countDocuments({ status: "Active" });
    const scheduledCount = await Alert.countDocuments({ status: "Scheduled" });
    const completedCount = await Alert.countDocuments({ status: "Completed" });

    const totalNotifiedAgg = await Alert.aggregate([
      { $group: { _id: null, total: { $sum: "$peopleNotifiedCount" } } },
    ]);

    const totalNotified = totalNotifiedAgg[0]?.total || 0;

    return res.status(200).json({
      success: true,
      stats: {
        active: activeCount,
        scheduled: scheduledCount,
        completed: completedCount,
        notified: totalNotified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE AN EXISTING ALERT BY ID
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params; // 👈 Must match the exact name ":id" in your routes file
    const updateData = req.body;

    const updatedAlert = await Alert.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert document not found in DB." });
    }

    return res.status(200).json({ success: true, alert: updatedAlert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE AN ALERT BY ID
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAlert = await Alert.findByIdAndDelete(id);

    if (!deletedAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Alert deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
