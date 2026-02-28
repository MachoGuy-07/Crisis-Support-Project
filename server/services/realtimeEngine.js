const Inventory = require("../models/Inventory");
const Request = require("../models/Request");
const {
  getVictimSnapshot,
  getVolunteerSnapshot,
  normalizePriority,
  toRequestMarker,
} = require("./dashboardService");
const { DEFAULT_CENTER, clamp } = require("../utils/geo");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(values) {
  return values[randomInt(0, values.length - 1)];
}

function randomPointNearCenter() {
  const latOffset = (Math.random() - 0.5) * 0.08;
  const lngOffset = (Math.random() - 0.5) * 0.08;
  return {
    lat: DEFAULT_CENTER.lat + latOffset,
    lng: DEFAULT_CENTER.lng + lngOffset,
  };
}

async function updateInventoryNoise() {
  const inventory = await Inventory.findOne();
  if (!inventory) return;

  inventory.foodWaterSupplies = clamp(
    inventory.foodWaterSupplies + randomInt(-12, 18),
    0,
    2000,
  );
  inventory.medicalSupplies = clamp(
    inventory.medicalSupplies + randomInt(-8, 10),
    0,
    1000,
  );
  inventory.shelterAvailability = clamp(
    inventory.shelterAvailability + randomInt(-5, 7),
    0,
    600,
  );
  inventory.volunteersReady = clamp(
    inventory.volunteersReady + randomInt(-4, 6),
    0,
    1000,
  );
  inventory.suppliesOnHand = clamp(
    inventory.suppliesOnHand + randomInt(-10, 12),
    0,
    2000,
  );
  inventory.volunteersInShift = clamp(
    inventory.volunteersInShift + randomInt(-1, 2),
    0,
    400,
  );

  await inventory.save();
}

async function maybeCreateRandomRequest() {
  if (Math.random() > 0.28) return null;

  const type = randomChoice(["medical", "food", "water", "shelter", "rescue"]);
  const point = randomPointNearCenter();
  const descriptionByType = {
    medical: "Immediate first-aid support needed at local camp.",
    food: "Food packs are running low for multiple families.",
    water: "Drinking water shortage reported in affected block.",
    shelter: "Temporary shelter required for displaced residents.",
    rescue: "Urgent transport needed for evacuation support.",
  };

  const request = await Request.create({
    requesterEmail: `auto-${Date.now()}@crisis.local`,
    type,
    description: descriptionByType[type],
    priority: normalizePriority(type),
    location: {
      type: "Point",
      coordinates: [point.lng, point.lat],
    },
  });

  return request;
}

async function maybeProgressPendingRequest() {
  if (Math.random() > 0.35) return;
  const request = await Request.findOne({ status: "pending" }).sort({ createdAt: 1 });
  if (!request) return;
  request.status = "assigned";
  await request.save();
}

async function emitSnapshots(io) {
  const [victimSnapshot, volunteerSnapshot] = await Promise.all([
    getVictimSnapshot({ ...DEFAULT_CENTER, radiusKm: 20, search: "" }),
    getVolunteerSnapshot({ ...DEFAULT_CENTER, radiusKm: 20, search: "" }),
  ]);

  io.emit("stats:update", {
    role: "victim",
    stats: victimSnapshot.stats,
    updatedAt: victimSnapshot.updatedAt,
  });
  io.emit("stats:update", {
    role: "volunteer",
    stats: volunteerSnapshot.stats,
    updatedAt: volunteerSnapshot.updatedAt,
  });
}

function startRealtimeEngine(io) {
  const intervalMs = Number(process.env.REALTIME_TICK_MS) || 9000;
  let isTickRunning = false;

  const timer = setInterval(async () => {
    if (isTickRunning) return;
    isTickRunning = true;

    try {
      await updateInventoryNoise();
      await maybeProgressPendingRequest();
      const request = await maybeCreateRandomRequest();

      if (request) {
        io.emit("request:new", toRequestMarker(request.toObject()));
      }

      await emitSnapshots(io);
    } catch (error) {
      console.error("[realtime-engine]", error);
    } finally {
      isTickRunning = false;
    }
  }, intervalMs);

  return () => clearInterval(timer);
}

module.exports = { startRealtimeEngine, emitSnapshots };
