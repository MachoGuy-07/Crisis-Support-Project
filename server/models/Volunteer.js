const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    assignedTasks: {
      type: Number,
      default: 0,
    },
    suppliesOnHand: {
      type: Number,
      default: 0,
    },
    inShift: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);
