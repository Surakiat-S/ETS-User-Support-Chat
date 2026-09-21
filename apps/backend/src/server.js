const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const env = require("./config/env");
const createTicketsRouter = require("./routes/tickets");
const metaRouter = require("./routes/meta");
const registerChatHandlers = require("./socket/register-chat-handlers");
const sqlConfig = require("./config/sql");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true
  })
);
app.use(express.json());

app.get("/health", async function healthHandler(req, res) {
  try {
    await sqlConfig.getPool();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.use("/api/tickets", createTicketsRouter(io));
app.use("/api/meta", metaRouter);

app.use(function errorHandler(error, req, res, next) {
  res.status(500).json({
    message: error.message || "Unexpected server error"
  });
});

registerChatHandlers(io);

server.listen(env.port, async function startServer() {
  try {
    await sqlConfig.getPool();
    console.log("ETS support backend listening on port " + env.port);
  } catch (error) {
    console.error("Failed to connect to SQL Server:", error.message);
  }
});
