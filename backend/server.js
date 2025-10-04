// 1. Load environment variables from the .env file
require('dotenv').config();
const API_URL = "https://code-to-text-teaching-assistant.onrender.com";

const express = require('express');
const cors = require('cors');
// 2. Import the OpenAI SDK, which is compatible with Groq
const OpenAI = require('openai');

const app = express();
const PORT = 8000;

// 3. Check for the API key at startup
if (!process.env.GROQ_API_KEY) {
  console.error('FATAL ERROR: GROQ_API_KEY is not defined in your .env file.');
  process.exit(1); // Exit the application if the key is missing
}

// 4. Initialize the client to use Groq's API endpoint
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// --- Middleware ---
app.use(cors()); // Enables your React app to communicate with this server
app.use(express.json()); // Allows the server to understand JSON data from requests

// --- Welcome Route ---
app.get('/', (req, res) => {
  res.status(200).json({ message: "Groq AI backend is running!" });
});

// --- Main AI Helper Function ---
async function callGroq(prompt, res) {
  try {
    const completion = await groq.chat.completions.create({
      // UPDATED: Switched to a current and supported model
      model: 'llama-3.1-8b-instant', 
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;
    res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error calling Groq API:', error.constructor.name);
    let errorMessage = 'An internal server error occurred.';
    if (error instanceof OpenAI.APIError) {
        errorMessage = error.message;
    }
    res.status(500).json({ error: `Failed to get a response from the Groq service. Reason: ${errorMessage}` });
  }
}

// --- API Routes ---
app.post('/explain', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });
  const prompt = `Explain the following code snippet for a beginner...\n\n\`\`\`\n${code}\n\`\`\``;
  await callGroq(prompt, res);
});

app.post('/refactor', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });
  const prompt = `Act as an expert programmer. Refactor the following code...\n\n\`\`\`\n${code}\n\`\`\``;
  await callGroq(prompt, res);
});

app.post('$/debug', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });
  const prompt = `Act as an expert code debugger. Analyze the following code...\n\n\`\`\`\n${code}\n\`\`\``;
  await callGroq(prompt, res);
});

app.post('$/translate', async (req, res) => {
  const { code, targetLanguage } = req.body;
  if (!code || !targetLanguage) {
    return res.status(400).json({ error: 'Code and target language are required.' });
  }
  const prompt = `Translate the following code snippet into ${targetLanguage}...\n\n\`\`\`\n${code}\n\`\`\``;
  await callGroq(prompt, res);
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Groq-powered AI backend is running on http://localhost:${PORT}`);
});

