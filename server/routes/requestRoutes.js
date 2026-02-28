const express = require("express");

const Inventory = require("../models/Inventory");
const Request = require("../models/Request");
const { normalizePriority, toRequestMarker } = require("../services/dashboardService");
const { clamp } = require("../utils/geo");

function createRequestRouter(io) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const requests = await Request.find().sort({ createdAt: -1 }).limit(80).lean();
    res.json({ requests });
  });

  router.post("/", async (req, res) => {
    try {
      const { requesterEmail, type, description, lat, lng } = req.body || {};

      if (!requesterEmail || !type || !description) {
        return res.status(400).json({
          message: "requesterEmail, type, and description are required.",
        });
      }

      const request = await Request.create({
        requesterEmail,
        type,
        description,
        priority: normalizePriority(type),
        location: {
          type: "Point",
          coordinates: [clamp(Number(lng), -180, 180), clamp(Number(lat), -90, 90)],
        },
      });

      await Inventory.findOneAndUpdate(
        {},
        {
          $inc: {
            volunteersReady: -1,
          },
        },
        { new: true },
      );

      io.emit("request:new", toRequestMarker(request.toObject()));
      io.emit("dashboard:refresh", { role: "volunteer" });

      return res.status(201).json({
        success: true,
        message: "Request created successfully.",
        requestId: String(request._id),
      });
    } catch (error) {
      console.error("[requests/create]", error);
      return res.status(500).json({
        message: "Failed to create request.",
      });
    }
  });

  return router;
}

module.exports = { createRequestRouter };
