const Inventory = require("../models/Inventory");
const Ngo = require("../models/Ngo");
const Request = require("../models/Request");
const Volunteer = require("../models/Volunteer");

const seedNgos = [
  {
    name: "Relief Food Collective",
    category: "food",
    description: "Prepared meal distribution and nutrition support.",
    location: { type: "Point", coordinates: [78.4701, 17.4021] },
    inventory: {
      foodWaterSupplies: 210,
      medicalSupplies: 16,
      shelterAvailability: 20,
      volunteersReady: 22,
    },
  },
  {
    name: "City Medical Response Unit",
    category: "medical",
    description: "Rapid response first-aid and trauma support.",
    location: { type: "Point", coordinates: [78.4892, 17.3698] },
    inventory: {
      foodWaterSupplies: 90,
      medicalSupplies: 120,
      shelterAvailability: 14,
      volunteersReady: 35,
    },
  },
  {
    name: "Blue Drop Water Point",
    category: "water",
    description: "Emergency hydration center and refill stations.",
    location: { type: "Point", coordinates: [78.505, 17.4032] },
    inventory: {
      foodWaterSupplies: 250,
      medicalSupplies: 12,
      shelterAvailability: 10,
      volunteersReady: 18,
    },
  },
  {
    name: "Hope Medical Aid Tent",
    category: "medical",
    description: "Rural outreach with ambulance dispatch.",
    location: { type: "Point", coordinates: [78.448, 17.3523] },
    inventory: {
      foodWaterSupplies: 70,
      medicalSupplies: 80,
      shelterAvailability: 25,
      volunteersReady: 28,
    },
  },
  {
    name: "Community Water & Hygiene Desk",
    category: "water",
    description: "Water purification and sanitation supplies.",
    location: { type: "Point", coordinates: [78.5282, 17.3866] },
    inventory: {
      foodWaterSupplies: 190,
      medicalSupplies: 20,
      shelterAvailability: 18,
      volunteersReady: 25,
    },
  },
  {
    name: "Emergency Food Bridge",
    category: "food",
    description: "Dry ration supply chain for crisis camps.",
    location: { type: "Point", coordinates: [78.4626, 17.3812] },
    inventory: {
      foodWaterSupplies: 310,
      medicalSupplies: 8,
      shelterAvailability: 19,
      volunteersReady: 24,
    },
  },
];

const seedRequests = [
  {
    requesterEmail: "aisha.r@example.com",
    type: "medical",
    description: "Two children need urgent first aid at temporary shelter.",
    location: { type: "Point", coordinates: [78.4914, 17.3912] },
    status: "pending",
    priority: "high",
  },
  {
    requesterEmail: "ravi.k@example.com",
    type: "food",
    description: "Food packets needed for 20 people near camp perimeter.",
    location: { type: "Point", coordinates: [78.4721, 17.3743] },
    status: "assigned",
    priority: "medium",
  },
  {
    requesterEmail: "sadia.h@example.com",
    type: "shelter",
    description: "Family of five needs temporary shelter immediately.",
    location: { type: "Point", coordinates: [78.5148, 17.3985] },
    status: "pending",
    priority: "medium",
  },
];

const seedVolunteers = [
  {
    name: "Arjun Singh",
    email: "arjun.v@example.com",
    assignedTasks: 2,
    suppliesOnHand: 190,
    inShift: true,
    isAvailable: true,
  },
  {
    name: "Maya Patel",
    email: "maya.v@example.com",
    assignedTasks: 1,
    suppliesOnHand: 160,
    inShift: true,
    isAvailable: true,
  },
  {
    name: "Tariq Khan",
    email: "tariq.v@example.com",
    assignedTasks: 1,
    suppliesOnHand: 110,
    inShift: false,
    isAvailable: false,
  },
];

const seedInventory = {
  foodWaterSupplies: 840,
  medicalSupplies: 254,
  shelterAvailability: 106,
  volunteersReady: 185,
  suppliesOnHand: 608,
  volunteersInShift: 17,
};

async function seedDatabaseIfNeeded() {
  const [ngoCount, requestCount, volunteerCount, inventoryCount] =
    await Promise.all([
      Ngo.countDocuments(),
      Request.countDocuments(),
      Volunteer.countDocuments(),
      Inventory.countDocuments(),
    ]);

  if (ngoCount === 0) {
    await Ngo.insertMany(seedNgos);
    console.log("[seed] NGO records inserted");
  }

  if (requestCount === 0) {
    await Request.insertMany(seedRequests);
    console.log("[seed] Request records inserted");
  }

  if (volunteerCount === 0) {
    await Volunteer.insertMany(seedVolunteers);
    console.log("[seed] Volunteer records inserted");
  }

  if (inventoryCount === 0) {
    await Inventory.create(seedInventory);
    console.log("[seed] Inventory record inserted");
  }
}

module.exports = { seedDatabaseIfNeeded };
