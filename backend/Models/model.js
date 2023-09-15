const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  creationDate: { type: Date, default: Date.now() },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
  isLate: {
    type: Boolean,
    default: function () {
      if (!this.dueDate) return false;
      const now = new Date();
      const dueDate = new Date(this.dueDate);
      const creationDate = new Date(this.creationDate);
      return now > dueDate && dueDate > creationDate;
    },
  },
});
module.exports = mongoose.model("Task", taskSchema);
