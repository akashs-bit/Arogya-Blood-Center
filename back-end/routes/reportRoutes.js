import express from "express";
import {
  getReportAnalytics,
  getAllReports,
} from "../controllers/reportController.js";
import Report from "../models/Report.js";
import User from "../models/User.js";
import Alert from "../models/Alert.js";

const router = express.Router();

router.get("/", getAllReports);
router.get("/analytics", getReportAnalytics);

// 1. POST: GENERATE REPORT WITH REAL SYSTEM LINK
router.post("/generate", async (req, res) => {
  try {
    const { type } = req.body;
    const randomId = "REP" + Math.floor(1000 + Math.random() * 9000);

    const newReport = new Report({
      reportId: randomId,
      title: `System Generated ${type || "General"} Overview`,
      type: type || "Donations",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Generated",
      // Point this to your actual backend server port file stream 👇
      downloadUrl: `http://localhost:5000/api/reports/download/${randomId}`,
    });

    await newReport.save();
    return res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET: FETCH AND DOWNLOAD THE REPORT FILE
router.get("/download/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const reportMeta = await Report.findOne({ reportId });

    if (!reportMeta) {
      return res.status(404).send("Report record not found in system storage.");
    }

    // Pull live metrics to write into the downloaded file body
    const totalDonors = await User.countDocuments({ role: "donor" });
    const emergencyAlerts = await Alert.countDocuments({ type: "Emergency" });

    // Aggregate blood group metrics from your real active documents
    const stockAggregation = await User.aggregate([
      { $match: { role: "donor" } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
    ]);

    let stockSummaryText = "";
    stockAggregation.forEach((item) => {
      stockSummaryText += `${item._id}: ${item.count} Units\n`;
    });

    // Build raw text report architecture layout
    const fileContent = `
==================================================
        BLOOD SYSTEM LIVE MANAGEMENT REPORT       
==================================================
Report ID    : ${reportMeta.reportId}
Title        : ${reportMeta.title}
Category     : ${reportMeta.type}
Generated On : ${reportMeta.date}
Status       : Verified Secure

---------------- LIVE CORE METRICS ----------------
Active Registered Donors : ${totalDonors}
Live Emergency Alerts    : ${emergencyAlerts}

--------------- LIVE STOCK INVENTORY --------------
${stockSummaryText || "No blood groups currently registered.\n"}
==================================================
        END OF LOG REPORT - PRIVACY SECURED       
==================================================
`;

    // Force browser engine to initiate immediate file container file transfer download
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=System_Report_${reportId}.txt`,
    );
    return res.send(fileContent);
  } catch (error) {
    return res
      .status(500)
      .send("Error compiling report file download stream: " + error.message);
  }
});

export default router;
