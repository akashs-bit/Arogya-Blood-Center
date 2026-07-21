import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🛠️ PERMANENT FIX: Force Node to find your .env file no matter where this script runs from
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

// ==========================================
// EXPORT 1: IMMEDIATE REGISTRATION EMAIL
// ==========================================
export const sendCampEmail = async ({
  email,
  name,
  campName,
  campLocation,
  campDate,
  campTime,
  preferredSlot, // Added field here
}) => {
  try {
    // Safety check log to guarantee credentials are loaded before attempting send
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(
        "❌ CRITICAL ERROR: Environment variables (.env) are not loading properly!",
      );
      return false;
    }

    console.log("=================================");
    console.log(`📧 DISPATCHING REGISTRATION EMAIL TO: ${email}`);
    console.log("=================================");

    const info = await transporter.sendMail({
      from: `"Arogya Blood Center" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Blood Donation Camp Registration Successful",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#dc2626;">
            🩸 Blood Donation Camp Registration Successful
          </h2>
          <p>Hello <b>${name}</b>,</p>
          <p>You have successfully registered for the blood donation camp.</p>
          <hr style="border:none;border-top:1px solid #eee;"/>
          <p><b>Camp Name:</b> ${campName}</p>
          <p><b>Location:</b> ${campLocation}</p>
          <p><b>Date:</b> ${new Date(campDate).toLocaleDateString()}</p>
          <p><b>Camp Overall Time:</b> ${campTime}</p>
          <p style="color:#dc2626;"><b>Your Preferred Time Slot:</b> ${preferredSlot || "Not Specified"}</p> 🌟
          <hr style="border:none;border-top:1px solid #eee;"/>
          <p>Please arrive 15 minutes before your selected slot.</p>
          <p>Thank you for helping save lives ❤️</p>
        </div>
      `,
    });

    console.log("✅ REGISTRATION EMAIL SENT SUCCESSFULLY");
    return true;
  } catch (error) {
    console.error("❌ REGISTRATION EMAIL ERROR:", error);
    return false;
  }
};

// ==========================================
// EXPORT 2: AUTOMATED CONTINUOUS REMINDER EMAIL
// ==========================================
export const sendCampReminderEmail = async ({
  email,
  name,
  campName,
  campLocation,
  campTime,
  preferredSlot, // Added field here for the Cron job
}) => {
  try {
    console.log(`📧 DISPATCHING REMINDER EMAIL TO: ${email}`);

    const info = await transporter.sendMail({
      from: `"Arogya Blood Center" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🩸 Reminder: Your Upcoming Blood Donation Camp!",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#dc2626;text-align:center;">
            📢 Appointment Reminder Notification
          </h2>
          <p>Hello <b>${name}</b>,</p>
          <p>This is a continuous reminder that you are registered to donate blood. Your valuable contribution saves lives!</p>
          
          <div style="background-color:#fef2f2;padding:15px;border-left:4px solid #dc2626;margin:15px 0;">
            <p style="margin:4px 0;"><b>Camp Name:</b> ${campName}</p>
            <p style="margin:4px 0;"><b>Location:</b> ${campLocation}</p>
            <p style="margin:4px 0;"><b>Camp Schedule:</b> ${campTime}</p>
            <p style="margin:4px 0;color:#dc2626;"><b>Your Chosen Time Slot:</b> ${preferredSlot || "Not Specified"}</p> 🌟
          </div>

          <hr style="border:none;border-top:1px solid #eee;"/>
          
          <h3 style="color:#333;">💡 Tips before donating blood:</h3>
          <ul>
            <li>Have a healthy, low-fat meal before your donation.</li>
            <li>Drink plenty of water or juice to stay hydrated.</li>
            <li>Get a good night's sleep (at least 7-8 hours).</li>
            <li>Make sure to carry a valid Government Photo ID card.</li>
          </ul>

          <p style="margin-top:20px;text-align:center;color:#666;font-size:14px;">
            Thank you for being a hero ❤️
          </p>
        </div>
      `,
    });

    console.log(
      `✅ REMINDER EMAIL SENT TO: ${email} WITH SLOT: ${preferredSlot || "Not Specified"}`,
    );
    return true;
  } catch (error) {
    console.error("❌ REMINDER EMAIL EXCEPTION ERROR:", error);
    return false;
  }
};
