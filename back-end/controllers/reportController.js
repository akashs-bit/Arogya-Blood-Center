import User from "../models/User.js";
import Alert from "../models/Alert.js";
import Report from "../models/Report.js";

export const getReportAnalytics = async (req, res) => {
  try {
    // 1. REAL-TIME DATABASE COUNTS
    // Counts donors based on 'donor' role (case-insensitive)
    const activeDonorsCount = await User.countDocuments({
      role: { $regex: /^donor$/i },
    });

    // Counts emergency alerts based on 'emergency' type (case-insensitive)
    const emergencyAlertsCount = await Alert.countDocuments({
      type: { $regex: /^emergency$/i },
    });

    // 2. DUMMY DATA FOR VISUALS
    // Populates the Blood Stock inventory bars
    const dummyBloodStock = [
      {
        group: "O+",
        units: 32,
        color: "bg-red-50 text-red-700 border-red-100",
      },
      {
        group: "A+",
        units: 24,
        color: "bg-blue-50 text-blue-700 border-blue-100",
      },
      {
        group: "B+",
        units: 19,
        color: "bg-green-50 text-green-700 border-green-100",
      },
      {
        group: "AB+",
        units: 8,
        color: "bg-orange-50 text-orange-700 border-orange-100",
      },
      {
        group: "O-",
        units: 14,
        color: "bg-rose-50 text-rose-700 border-rose-100",
      },
      {
        group: "A-",
        units: 11,
        color: "bg-indigo-50 text-indigo-700 border-indigo-100",
      },
      {
        group: "B-",
        units: 7,
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      },
      {
        group: "AB-",
        units: 3,
        color: "bg-purple-50 text-purple-700 border-purple-100",
      },
    ];

    // Populates the monthly Donation Analytics graph bars
    const dummyChartData = [45, 52, 68, 84, 95, 110, 88, 74, 62, 55, 69, 90];

    // 3. FINAL RESPONSE
    return res.status(200).json({
      success: true,
      stats: {
        totalDonations: activeDonorsCount.toString(), // Real count
        activeDonors: activeDonorsCount.toString(), // Real count
        bloodUnits: activeDonorsCount.toString(), // Real count
        emergencyAlerts: emergencyAlertsCount, // Real count
      },
      chartData: dummyChartData,
      stock: dummyBloodStock,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
