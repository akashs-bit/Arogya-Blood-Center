import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import reportRoutes from "./routes/reportRoutes.js"
import { startReminderCron } from "./utils/reminderCron.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);


// Connect to MongoDB first
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    // ✅ Start the cron job worker ONLY after database is ready
    startReminderCron();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });
