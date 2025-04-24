import { NexusXError } from '@nexusx/sdk';
import { initializeClient } from '../utils';
import { extractStructuredDataToolParamSchemaType } from "./tool-types";

export const extractStructuredDataToolName = 'extract_structured_data';
export const extractStructuredDataToolDescription = 'Convert messy HTML into structured JSON';

export async function extractStructuredDataTool(params: {
  urls: string[];
  prompt: string;
  schema?: any;
  sessionOptions?: {
    useProxy?: boolean;
    useStealth?: boolean;
    solveCaptchas?: boolean;
    acceptCookies?: boolean;
    profile?: {
      id?: string;
      persistChanges?: boolean;
    };
  };
}) {
  try {
    const client = await initializeClient();
    const result = await client.browser.extractStructuredData(params.urls, {
      prompt: params.prompt,
      schema: params.schema,
      sessionOptions: params.sessionOptions,
    });
    return result;
  } catch (error) {
    if (error instanceof NexusXError) {
      throw new Error(`NexusX API error: ${error.message}`);
    }
    throw error;
  }
}
