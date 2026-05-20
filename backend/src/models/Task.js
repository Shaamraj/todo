const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    text: {
      type: String,
      required: true
    },

    completed: {
      type: Boolean,
      default: false
    },

    dueDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);