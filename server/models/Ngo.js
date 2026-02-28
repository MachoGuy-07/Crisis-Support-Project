const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["food", "medical", "water"],
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    inventory: {
      foodWaterSupplies: { type: Number, default: 0 },
      medicalSupplies: { type: Number, default: 0 },
      shelterAvailability: { type: Number, default: 0 },
      volunteersReady: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

ngoSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Ngo || mongoose.model("Ngo", ngoSchema);
