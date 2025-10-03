// src/services/api.js
const API_URL = "https://code-to-text-teaching-assistant.onrender.com";

export const fetchExplanation = async (code) => {
  const response = await fetch(`${API_URL}/explain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};