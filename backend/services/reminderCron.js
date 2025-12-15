const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const sendEmail = require("./emailService");

// ----------------------------------
// CRON JOB — RUNS EVERY 1 MINUTE
// ----------------------------------
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Find reminders that should be sent
    const reminders = await Reminder.find({
      reminderTime: { $lte: now },
      isSent: false,
    }).populate("userId");

    for (const reminder of reminders) {
      // Send email
      await sendEmail(
        reminder.userId.email,
        "ProdMate Reminder",
        reminder.message
      );

      // Mark reminder as sent
      reminder.isSent = true;
      await reminder.save();
    }

  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
});
