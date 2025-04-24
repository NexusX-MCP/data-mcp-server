declare module '@modelcontextprotocol/sdk/types.js' {
  export interface CallToolResult {
    content: Array<{
      type: string;
      text: string;
    }>;
    isError: boolean;
  }
} 