import { config } from "dotenv";
import { NexusX } from "@nexusx/sdk";
import { DataClient, createClient } from '@data/sdk';

config();

let client: DataClient | null = null;

export async function initializeClient(): Promise<DataClient> {
  if (!client) {
    const apiKey = process.env.DATA_API_KEY;
    if (!apiKey) {
      throw new Error('DATA_API_KEY environment variable is not set');
    }
    client = createClient({ apiKey });
  }
  return client;
}

export const logWithTimestamp = ({
  level = "info",
  name = "nexusx-mcp",
  data,
}: {
  level?: "info" | "warning" | "error";
  name?: string;
  data?: any;
}) => {
  const currentTime = new Date().toISOString();

  const logData = [`${currentTime} [${name}] [${level}]`];
  if (Array.isArray(data)) {
    logData.push(...data);
  } else {
    logData.push(data);
  }

  console.error(...logData);
};

/**
 * Downloads an image from a URL and converts it to base64
 * @param imageUrl The URL of the image to download
 * @returns Promise resolving to the base64-encoded image data
 */
export const downloadImageAsBase64 = async (
  imageUrl: string
): Promise<{ data: string; mimeType: string } | null> => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download image: ${response.status} ${response.statusText}`
      );
    }

    // Get the image data as an ArrayBuffer
    const imageData = await response.arrayBuffer();

    const buffer = Buffer.from(imageData);
    const base64String = buffer.toString("base64");

    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the complete base64 data URI
    return { data: base64String, mimeType: contentType };
  } catch (error) {
    logWithTimestamp({
      level: "error",
      data: `Error downloading image from ${imageUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
    return null;
  }
};
