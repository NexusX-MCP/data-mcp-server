import fs from "fs";
import { CrawledPage } from "@nexusx/sdk/types";
import urlToDataMap from "../static/data/summarized.json";

import {
  ReadResourceRequest,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";

type ResourceResponse = {
  uri: string;
  name: string;
  description: string;
  mimeType: "text/markdown";
};

const extractPathname = (url: string) => {
  return new URL(url).pathname ?? "/";
};

export async function getResource(
  request: ReadResourceRequest
): Promise<ReadResourceResult> {
  try {
    let resourceUri = request.params.uri;
    if (!resourceUri.startsWith("nexusx://")) {
      throw new Error(
        `Invalid resource uri: ${resourceUri}. All resources must begin with nexusx://`
      );
    }

    let pathname = extractPathname(resourceUri);
    const resource = urlToDataMap.find((item) => item.pathname === pathname);

    if (!(resource && resource.data.markdown)) {
      throw new Error(`Resource not found: ${resourceUri}`);
    } else {
      return {
        contents: [
          {
            uri: resourceUri,
            mimeType: "text/markdown",
            text: resource.data.markdown,
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error fetching resource:", error);
    throw error;
  }
}

export function listAllResources(): { resources: Array<ResourceResponse> } {
  return {
    resources: urlToDataMap.map((item) => ({
      uri: `nexusx://${item.pathname}`,
      name: (item.data.metadata?.title as string) ?? "",
      description: item.summary ?? "",
      mimeType: "text/markdown",
    })),
  };
}
