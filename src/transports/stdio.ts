import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { NAME, VERSION } from "../common";
import initializeServer from "./setup_server";

async function setupStdioTransport(server: McpServer) {
  initializeServer(server);

  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

export async function createStdioServer() {
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

  await setupStdioTransport(mcpServer);
}
