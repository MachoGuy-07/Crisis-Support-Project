require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { connectDatabase } = require("./config/database");
const { createDashboardRouter } = require("./routes/dashboardRoutes");
const { createRequestRouter } = require("./routes/requestRoutes");
const { createVolunteerRouter } = require("./routes/volunteerRoutes");
const { seedDatabaseIfNeeded } = require("./seed/seedData");
const { emitSnapshots, startRealtimeEngine } = require("./services/realtimeEngine");

const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "crisis-support-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/dashboard", createDashboardRouter());
app.use("/api/requests", createRequestRouter(io));
app.use("/api/volunteers", createVolunteerRouter(io));

io.on("connection", (socket) => {
  console.log(`[socket] connected ${socket.id}`);

  socket.on("dashboard:subscribe", ({ role }) => {
    if (role === "victim" || role === "volunteer") {
      socket.join(`dashboard:${role}`);
    }
  });

  socket.on("dashboard:unsubscribe", ({ role }) => {
    if (role === "victim" || role === "volunteer") {
      socket.leave(`dashboard:${role}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[socket] disconnected ${socket.id}`);
  });
});

let stopRealtimeEngine = null;

async function startServer() {
  await connectDatabase();
  await seedDatabaseIfNeeded();

  stopRealtimeEngine = startRealtimeEngine(io);
  await emitSnapshots(io);

  server.listen(PORT, () => {
    console.log(`[server] API running at http://localhost:${PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`[server] received ${signal}, shutting down...`);
  if (stopRealtimeEngine) stopRealtimeEngine();
  io.removeAllListeners();

  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("[server] failed to start", error);
  process.exit(1);
});
