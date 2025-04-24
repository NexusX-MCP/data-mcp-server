import { NexusXError } from '@nexusx/sdk'; // Import SDK error type
import { initializeClient } from '../utils';

export const createProfileToolName = 'create_profile';
export const createProfileToolDescription = 'Creates a new persistent NexusX profile.';

export async function createProfileTool(params: { name: string }) {
  try {
    const client = await initializeClient();
    const profile = await client.profiles.create(params.name);
    return profile;
  } catch (error) {
    // Check if it's a specific NexusX SDK error
    if (error instanceof NexusXError) {
      throw new Error(`NexusX API error: ${error.message}`);
    }
    throw error;
  }
}
