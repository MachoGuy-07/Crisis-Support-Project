const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    requesterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["medical", "food", "water", "shelter", "rescue", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "resolved"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedVolunteerEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

requestSchema.index({ location: "2dsphere" });

module.exports =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
