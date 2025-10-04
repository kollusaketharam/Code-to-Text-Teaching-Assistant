// src/services/api.js

/**
 * A centralized function to handle all API calls to the backend.
 * @param {string} action - The endpoint to call (e.g., 'explain', 'refactor').
 * @param {object} body - The request body to send.
 * @returns {Promise<object>} The JSON response from the server.
 */
export const callApi = async (action, body) => {
  // Use the environment variable for the API URL.
  const API_URL ="https://code-to-text-teaching-assistant.onrender.com";

  const response = await fetch(`/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  console.log("VERCEL IS TRYING TO CALL THIS EXACT URL:", API_URL);

  // If the response is not successful, parse the error and throw it.
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'An unknown server error occurred.');
  }

  // If successful, return the JSON data.
  return response.json();
};