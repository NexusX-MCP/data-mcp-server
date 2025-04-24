import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient } from "../utils";
import { ClaudeComputerUseToolParamSchemaType } from "./tool-types";
import { NexusXError } from '@nexusx/sdk';
import { initializeClient } from '../utils';

export const claudeComputerUseToolName = 'claude_computer_use_agent';
export const claudeComputerUseToolDescription = 'Complex browser tasks using Claude computer use';

export async function claudeComputerUseTool(params: {
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
    const result = await client.browser.claudeComputerUse(params.task, {
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

export async function claudeComputerUseTool({
  task,
  sessionOptions,
  returnStepInfo,
  maxSteps,
}: ClaudeComputerUseToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    const result = await client.agents.claudeComputerUse.startAndWait({
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

      const toolResultText = `Final Result: ${
        taskData.finalResult
      }\n\nSteps: ${JSON.stringify(taskData.steps, null, 2)}`;

      response.content.push({
        type: "text",
        text: toolResultText,
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
