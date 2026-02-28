const express = require("express");

const Inventory = require("../models/Inventory");
const Request = require("../models/Request");
const Volunteer = require("../models/Volunteer");

function createVolunteerRouter(io) {
  const router = express.Router();

  router.post("/offer", async (req, res) => {
    try {
      const { volunteerEmail } = req.body || {};
      if (!volunteerEmail) {
        return res.status(400).json({
          message: "volunteerEmail is required.",
        });
      }

      const normalizedEmail = String(volunteerEmail).trim().toLowerCase();
      const existingVolunteer = await Volunteer.findOne({ email: normalizedEmail });
      const isAlreadyInShift = existingVolunteer?.inShift === true;

      if (!existingVolunteer) {
        const fallbackName = normalizedEmail.split("@")[0].replace(/[._-]/g, " ");
        await Volunteer.create({
          name: fallbackName || "Volunteer",
          email: normalizedEmail,
          assignedTasks: 0,
          suppliesOnHand: 20,
          inShift: true,
          isAvailable: true,
        });
      } else {
        existingVolunteer.inShift = true;
        existingVolunteer.isAvailable = true;
        await existingVolunteer.save();
      }

      if (!isAlreadyInShift) {
        await Inventory.findOneAndUpdate(
          {},
          {
            $inc: {
              volunteersInShift: 1,
              volunteersReady: 1,
            },
          },
        );
      }

      io.emit("dashboard:refresh", { role: "volunteer" });
      io.emit("dashboard:refresh", { role: "victim" });

      return res.status(200).json({
        success: true,
        message: "Volunteer marked as available.",
      });
    } catch (error) {
      console.error("[volunteers/offer]", error);
      return res.status(500).json({
        message: "Failed to update volunteer status.",
      });
    }
  });

  router.post("/assign-request", async (req, res) => {
    try {
      const { requestId, volunteerEmail } = req.body || {};
      if (!requestId || !volunteerEmail) {
        return res.status(400).json({
          message: "requestId and volunteerEmail are required.",
        });
      }

      const request = await Request.findByIdAndUpdate(
        requestId,
        {
          status: "assigned",
          assignedVolunteerEmail: String(volunteerEmail).toLowerCase(),
        },
        { new: true },
      );

      if (!request) {
        return res.status(404).json({
          message: "Request not found.",
        });
      }

      await Volunteer.findOneAndUpdate(
        { email: String(volunteerEmail).toLowerCase() },
        { $inc: { assignedTasks: 1 } },
      );

      io.emit("dashboard:refresh", { role: "volunteer" });

      return res.status(200).json({
        success: true,
        message: "Request assigned successfully.",
      });
    } catch (error) {
      console.error("[volunteers/assign-request]", error);
      return res.status(500).json({
        message: "Failed to assign request.",
      });
    }
  });

  return router;
}

module.exports = { createVolunteerRouter };
