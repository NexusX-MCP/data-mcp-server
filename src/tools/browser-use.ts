import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient } from "../utils";
import { browserUseToolParamSchemaType } from "./tool-types";
import { NexusXError } from '@nexusx/sdk';
import { initializeClient } from '../utils';

export const browserUseToolName = 'browser_use_agent';
export const browserUseToolDescription = 'Fast, lightweight browser automation with the Browser Use agent';

export async function browserUseTool(params: {
  task: string;
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
  returnStepInfo?: boolean;
  maxSteps?: number;
}) {
  try {
    const client = await initializeClient();
    const result = await client.browser.use(params.task, {
      sessionOptions: params.sessionOptions,
      returnStepInfo: params.returnStepInfo,
      maxSteps: params.maxSteps,
    });
    return result;
  } catch (error) {
    if (error instanceof NexusXError) {
      throw new Error(`NexusX API error: ${error.message}`);
    }
    throw error;
  }
}

export async function browserUseToolOld({
  task,
  sessionOptions,
  returnStepInfo,
  maxSteps,
}: browserUseToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    const result = await client.agents.browserUse.startAndWait({
      task,
      sessionOptions,
      maxSteps,
    });

    if (result.error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: result.error,
          },
        ],
      };
    }

    const response: CallToolResult = {
      content: [],
      isError: false,
    };

    if (result.data) {
      let taskData = result.data;

      if (!returnStepInfo) {
        taskData.steps = [];
      }

      response.content.push({
        type: "text",
        text: JSON.stringify(taskData),
      });
    } else {
      response.content.push({
        type: "text",
        text: "Task result data is empty/missing",
        isError: true,
      });
    }

    return response;
  } catch (error) {
    return {
      content: [{ type: "text", text: `${error}` }],
      isError: true,
    };
  }
}
