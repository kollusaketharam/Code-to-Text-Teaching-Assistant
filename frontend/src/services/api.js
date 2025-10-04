// src/services/api.js

/**
 * A centralized function to handle all API calls to the backend.
 * @param {string} action - The endpoint to call (e.g., 'explain', 'refactor').
 * @param {object} body - The request body to send.
 * @returns {Promise<object>} The JSON response from the server.
 */
export const callApi = async (action, body) => {
  // Use Vite's method for accessing environment variables.
  const API_URL = import.meta.env.VITE_API_URL;

  // Check if the API_URL is defined. If not, it's a configuration error.
  if (!API_URL) {
    throw new Error("Configuration error: VITE_API_URL is not defined in your Vercel settings.");
  }

  const response = await fetch(`${API_URL}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // If the response is not successful, parse the error and throw it.
  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      // If the response isn't valid JSON (e.g., a 404 page), create a generic error.
      throw new Error(`The server responded with an error: ${response.status}`);
    });
    throw new Error(errorData.error || 'An unknown server error occurred.');
  }

  // If successful, return the JSON data.
  return response.json();
};

