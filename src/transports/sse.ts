import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";

import { NAME, VERSION } from "../common";
import initializeServer from "./setup_server";

function setupSSETransport(app: express.Application, server: McpServer) {
  initializeServer(server);

  console.log("Setting up SSE server");

  let sseTransport: SSEServerTransport;

  app.get("/sse", async (request, response) => {
    sseTransport = new SSEServerTransport("/messages", response);
    await server.connect(sseTransport);
  });

  app.post("/messages", async (request, response) => {
    if (!sseTransport) {
      response.status(400).send("No transport found");
      return;
    }
    await sseTransport.handlePostMessage(request, response);
  });
}

export async function createSSEServer() {
  const expressApp = express();
  const mcpServer = new McpServer(
    {
      name: NAME,
      version: VERSION,
    },
    {
      capabilities: {
        resources: {},
      },
    }
  );

  setupSSETransport(expressApp, mcpServer);

  return expressApp;
}
