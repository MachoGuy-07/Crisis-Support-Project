const express = require("express");

const {
  getVictimSnapshot,
  getVolunteerSnapshot,
} = require("../services/dashboardService");
const { parseGeoQuery } = require("../utils/geo");

function createDashboardRouter() {
  const router = express.Router();

  router.get("/victim", async (req, res) => {
    try {
      const { lat, lng, radiusKm } = parseGeoQuery(req.query);
      const payload = await getVictimSnapshot({
        lat,
        lng,
        radiusKm,
        search: req.query.search || "",
      });

      res.json(payload);
    } catch (error) {
      console.error("[dashboard/victim]", error);
      res.status(500).json({
        message: "Failed to load victim dashboard data.",
      });
    }
  });

  router.get("/volunteer", async (req, res) => {
    try {
      const { lat, lng, radiusKm } = parseGeoQuery(req.query);
      const payload = await getVolunteerSnapshot({
        lat,
        lng,
        radiusKm,
        search: req.query.search || "",
      });

      res.json(payload);
    } catch (error) {
      console.error("[dashboard/volunteer]", error);
      res.status(500).json({
        message: "Failed to load volunteer dashboard data.",
      });
    }
  });

  return router;
}

module.exports = { createDashboardRouter };
