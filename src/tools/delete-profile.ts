import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { initializeClient } from '../utils';
import { DeleteProfileToolParamSchemaType } from './tool-types.js';
import { DataError } from '@data/sdk';

// The handler function receives parsed parameters
export async function deleteProfileTool(
  params: DeleteProfileToolParamSchemaType
): Promise<CallToolResult> {
  const { profileId } = params; // Destructure validated profileId

  try {
    const client = await initializeClient(); // Get client instance

    // Call the SDK delete method
    await client.profiles.delete(profileId);

    // Return success
    return {
      content: [
        {
          type: 'text',
          text: `Successfully deleted profile with ID: ${profileId}`,
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    let errorMessage = `An unknown error occurred while deleting profile ${profileId}.`;
    let isError = true;

    // Check if it's a specific Data SDK error
    if (error instanceof DataError) {
      if (error.statusCode === 404) {
        errorMessage = `Profile with ID ${profileId} not found.`;
        // Optionally, you might decide this isn't a true 'error' state for the tool
        // isError = false; // Depending on desired behavior
      } else {
        errorMessage = `Failed to delete profile ${profileId}: ${error.message} (Status: ${error.statusCode || 'N/A'})`;
      }
    } else if (error instanceof Error) {
      errorMessage = `Failed to delete profile ${profileId}: ${error.message}`;
    }

    // Return error result
    return {
      content: [{ type: 'text', text: errorMessage }],
      isError: isError,
    };
  }
}

// Export name and description separately for registration
export const deleteProfileToolName = 'delete_profile';
export const deleteProfileToolDescription =
  'Deletes an existing persistent Data profile.';
