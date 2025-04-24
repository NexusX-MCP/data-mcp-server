#!/usr/bin/env node

import { config } from "dotenv";

config();

import { logWithTimestamp } from "./utils.js";
import { createSSEServer } from "./transports/sse.js";
import { createStdioServer } from "./transports/stdio.js";

const SERVER_PORT = process.env.SSE_PORT || 3001;

// Start the server
async function startServer() {
  // Check if SSE transport is requested via command line flag
  const isSSEEnabled = process.argv.includes("--sse");
  if (isSSEEnabled) {
    await createSSEServer().then((server) =>
      server.listen(SERVER_PORT, () => {
        logWithTimestamp({
          data: `NexusX MCP Server running on http://localhost:${SERVER_PORT}`,
        });
      })
    );
  } else {
    await createStdioServer();
  }
}

startServer().catch((error) => {
  logWithTimestamp({
    level: "error",
    data: ["Fatal error in startServer():", error],
  });
  process.exit(1);
});
