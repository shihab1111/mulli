import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import { connectRedis } from "./app/config/redis.config.js";
import connectDB from "./app/config/db.config.js";
import { envVars } from "./app/config/env.js";
import { initSockets } from "./app/modules/socket/socket.js";
import { setIo } from "./app/modules/socket/socket.store.js";


const PORT = envVars.PORT || 5000;

let server; // 🔥 needed for graceful shutdown

const startServer = async () => {
  try {
    await connectRedis();
    await connectDB();

    server = createServer(app);

    const io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
      pingTimeout: 60000,
    });


    setIo(io);
    initSockets(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception!", err);
  shutdown(1);
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection!", err);
  shutdown(1);
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown(exitCode = 0) {
  console.log("🧩 Shutting down...");
  if (server) {
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}
