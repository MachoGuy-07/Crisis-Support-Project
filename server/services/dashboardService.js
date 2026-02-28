const Inventory = require("../models/Inventory");
const Ngo = require("../models/Ngo");
const Request = require("../models/Request");
const Volunteer = require("../models/Volunteer");
const { geoNearCondition } = require("../utils/geo");

function searchRegex(search = "") {
  const trimmed = search.trim();
  if (!trimmed) return null;
  return new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

function normalizePriority(type) {
  if (type === "medical" || type === "rescue") return "high";
  if (type === "shelter" || type === "food") return "medium";
  return "low";
}

function toNgoMarker(ngo) {
  return {
    id: String(ngo._id),
    name: ngo.name,
    kind: ngo.category,
    lat: ngo.location.coordinates[1],
    lng: ngo.location.coordinates[0],
    description: ngo.description || "Realtime NGO support point",
    updatedAt: ngo.updatedAt,
  };
}

function toRequestMarker(request) {
  return {
    id: String(request._id),
    name: `${request.type.toUpperCase()} Request`,
    kind: "request",
    lat: request.location.coordinates[1],
    lng: request.location.coordinates[0],
    description: request.description,
    priority: request.priority || normalizePriority(request.type),
    status: request.status,
    updatedAt: request.updatedAt,
  };
}

async function getVictimSnapshot({ lat, lng, radiusKm, search }) {
  const regex = searchRegex(search);
  const filter = {
    isActive: true,
    location: geoNearCondition(lat, lng, radiusKm),
  };

  if (regex) {
    filter.$or = [
      { name: regex },
      { category: regex },
      { description: regex },
    ];
  }

  const [ngos, inventoryDoc] = await Promise.all([
    Ngo.find(filter).limit(120).lean(),
    Inventory.findOne().sort({ updatedAt: -1 }).lean(),
  ]);

  const fallbackStats = ngos.reduce(
    (accumulator, ngo) => ({
      foodWaterSupplies:
        accumulator.foodWaterSupplies + (ngo.inventory?.foodWaterSupplies || 0),
      medicalSupplies:
        accumulator.medicalSupplies + (ngo.inventory?.medicalSupplies || 0),
      shelterAvailability:
        accumulator.shelterAvailability + (ngo.inventory?.shelterAvailability || 0),
      volunteersReady:
        accumulator.volunteersReady + (ngo.inventory?.volunteersReady || 0),
    }),
    {
      foodWaterSupplies: 0,
      medicalSupplies: 0,
      shelterAvailability: 0,
      volunteersReady: 0,
    },
  );

  return {
    center: { lat, lng },
    radiusKm,
    markers: ngos.map(toNgoMarker),
    stats: {
      foodWaterSupplies:
        inventoryDoc?.foodWaterSupplies ?? fallbackStats.foodWaterSupplies,
      medicalSupplies:
        inventoryDoc?.medicalSupplies ?? fallbackStats.medicalSupplies,
      shelterAvailability:
        inventoryDoc?.shelterAvailability ?? fallbackStats.shelterAvailability,
      volunteersReady:
        inventoryDoc?.volunteersReady ?? fallbackStats.volunteersReady,
    },
    updatedAt: new Date().toISOString(),
  };
}

async function getVolunteerSnapshot({ lat, lng, radiusKm, search }) {
  const regex = searchRegex(search);
  const requestFilter = {
    status: { $in: ["pending", "assigned"] },
    location: geoNearCondition(lat, lng, radiusKm),
  };

  if (regex) {
    requestFilter.$or = [
      { type: regex },
      { description: regex },
      { requesterEmail: regex },
      { status: regex },
    ];
  }

  const [requests, inventoryDoc, pendingRequests, assignedTasks, volunteerStats] =
    await Promise.all([
      Request.find(requestFilter).sort({ createdAt: -1 }).limit(120).lean(),
      Inventory.findOne().sort({ updatedAt: -1 }).lean(),
      Request.countDocuments({ status: "pending" }),
      Request.countDocuments({ status: "assigned" }),
      Volunteer.aggregate([
        {
          $group: {
            _id: null,
            volunteersInShift: {
              $sum: {
                $cond: [{ $eq: ["$inShift", true] }, 1, 0],
              },
            },
            suppliesOnHand: { $sum: "$suppliesOnHand" },
          },
        },
      ]),
    ]);

  const grouped = volunteerStats[0] || {
    volunteersInShift: 0,
    suppliesOnHand: 0,
  };

  return {
    center: { lat, lng },
    radiusKm,
    markers: requests.map(toRequestMarker),
    stats: {
      assignedTasks,
      pendingRequests,
      suppliesOnHand: inventoryDoc?.suppliesOnHand ?? grouped.suppliesOnHand ?? 0,
      volunteersInShift:
        inventoryDoc?.volunteersInShift ?? grouped.volunteersInShift ?? 0,
    },
    updatedAt: new Date().toISOString(),
  };
}

module.exports = {
  getVictimSnapshot,
  getVolunteerSnapshot,
  normalizePriority,
  toRequestMarker,
};
