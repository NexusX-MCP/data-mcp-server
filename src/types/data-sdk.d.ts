declare module '@data/sdk' {
  export class DataError extends Error {
    statusCode?: number;
    constructor(message: string, statusCode?: number);
  }

  export interface DataClient {
    profiles: {
      list(params?: { page?: number; limit?: number }): Promise<any>;
      delete(profileId: string): Promise<void>;
    };
  }

  export function createClient(config: { apiKey: string }): DataClient;
} 