const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    foodWaterSupplies: {
      type: Number,
      default: 0,
    },
    medicalSupplies: {
      type: Number,
      default: 0,
    },
    shelterAvailability: {
      type: Number,
      default: 0,
    },
    volunteersReady: {
      type: Number,
      default: 0,
    },
    suppliesOnHand: {
      type: Number,
      default: 0,
    },
    volunteersInShift: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
