import cron from "node-cron";
import CampRegistration from "../models/CampRegistration.js";
import { sendCampReminderEmail } from "./sendEmail.js";

export const startReminderCron = () => {
  // ⏰ Runs every 15 minutes to check for due reminders in the background
  cron.schedule("*/15 * * * *", async () => {
    console.log("🔍 [CRON RUNNING] Checking continuous camp reminders...");

    try {
      const now = new Date();
      // Calculate the time window for 4 hours ago
      const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

      // 🎯 Find users whose camp is in the future AND need a reminder
      const registrations = await CampRegistration.find({
        campDate: { $gt: now }, // Camp must be an upcoming event
        $or: [
          {
            // Condition A: New registration, has not received any reminder yet
            lastReminderSentAt: null,
          },
          {
            // Condition B: Already received a reminder, but 4 hours have passed since the last one
            lastReminderSentAt: { $lte: fourHoursAgo },
          },
        ],
      });

      if (registrations.length === 0) {
        console.log("ℹ️ No users found requiring a reminder at this time.");
        return;
      }

      console.log(
        `📧 Found ${registrations.length} user(s) for continuous 4-hour reminder.`,
      );

      for (const reg of registrations) {
        try {
          // ✅ FIXED: Now safely passing preferredSlot to the email utility
          await sendCampReminderEmail({
            email: reg.email,
            name: reg.fullName,
            campName: reg.campName,
            campLocation: reg.campLocation,
            campTime: reg.campTime,
            preferredSlot: reg.preferredSlot || "Not Specified", // Agar khali ho toh safe fallback
          });

          // ✨ Update the timestamp to lock this user for the next 4 hours
          reg.lastReminderSentAt = new Date();
          await reg.save();

          console.log(
            `✅ Reminder successfully sent to: ${reg.email} with slot: ${reg.preferredSlot}`,
          );
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${reg.email}:`, emailError);
        }
      }

      console.log("✅ All pending reminder emails processed successfully.");
    } catch (error) {
      console.error("❌ CRON JOB EXCEPTION ERROR:", error);
    }
  });
};
