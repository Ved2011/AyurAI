// Central root server.js entry point for PM2 and production deployment on port 8000
const path = require("path");

process.env.PORT = process.env.PORT || 8000;

require(path.join(__dirname, "backend", "server.js"));
