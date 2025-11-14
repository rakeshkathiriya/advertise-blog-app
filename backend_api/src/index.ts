import mongoose from "mongoose";
import { Server } from "node:http";
import app from "./app";
import { connectDB } from "./configs/connectDB.config";
import logger from "./configs/logger.config";
// Environment variables
const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const NODE_ENV = process.env.NODE_ENV || "production";

// Enable mongoose debug mode in non-production environments
if (NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// DB Connection
connectDB()

// Create server
let server:Server;

server = app.listen(Number(PORT), HOSTNAME, () => {
   logger.info(
    `Server running in ${NODE_ENV} mode on port ${PORT} and hostname is ${HOSTNAME}.`
  );
})

// Handle server errors
const exitHandler = (): void  => {
  if (server) {
    server.close(() => {
      logger.error("Server closed.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Error handler for unexpected exceptions
const unexpectedErrorHandler = (error:unknown): void => {
  if (error instanceof Error) {
    logger.error(error);
  } else {
    logger.error(new Error(String(error)));
  }
  exitHandler();
};

// Node process events
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  logger.info("SIGTERM received.");
  if (server) {
    logger.warn("Closing server...");
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  }
});
