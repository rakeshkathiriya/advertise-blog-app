import app from "./app";

// Environment variables
const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const NODE_ENV = process.env.NODE_ENV || "production";

// Create server
let server;

server = app.listen(Number(PORT), HOSTNAME, () => {
  console.info(
    `Server running in ${NODE_ENV} mode on port ${PORT} and hostname is ${HOSTNAME}.`
  );
})