const cron = require("node-cron");

const Task = require("../models/Task");
const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking reminders...");

    const now = new Date();

    // DEMO MODE (1 minute)
    const reminderTime = new Date(
      now.getTime() + 1 * 60 * 1000
    );

    const tasks = await Task.find({
      completed: false,
      reminderSent: false,
      dueDate: {
        $lte: reminderTime,
        $gte: now
      }
    });

    for (const task of tasks) {
      const user = await User.findById(
        task.userId
      );

      if (!user) continue;

      await sendEmail(
        user.email,
        "Task Reminder",
        `Reminder: "${task.text}" is due soon.`
      );

      task.reminderSent = true;

      await task.save();
    }
  } catch (error) {
    console.error(error);
  }
});