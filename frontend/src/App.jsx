import React, { useState } from 'react';
import './App.css'; // This line imports the stylesheet below

// Main App Component - contains all logic and UI
export default function App() {
  // State to hold the user's code input
  const [code, setCode] = useState('');
  // State to hold the AI's response
  const [result, setResult] = useState('');
  // State to manage loading indicators
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any potential errors
  const [error, setError] = useState('');

  /**
   * Handles all API calls to the backend.
   * @param {string} action - The endpoint to call (e.g., 'explain', 'refactor').
   */
  const handleApiCall = async (action) => {
    if (!code.trim()) {
      setError('Please enter some code before submitting.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      let requestBody = { code };

      // Special case for translation to get the target language
      if (action === 'translate') {
        const targetLanguage = prompt("Enter the language to translate the code to:", "Python");
        if (!targetLanguage) {
          setIsLoading(false);
          return; // User cancelled the prompt
        }
        requestBody.targetLanguage = targetLanguage;
      }

      // Make the fetch request to your running Node.js server
      const response = await fetch(`http://localhost:8000/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

      const data = await response.json();
      setResult(data.result);

    } catch (err) {
      console.error(`Error during ${action}:`, err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <h1>AI Code Assistant</h1>
          <p>Enter your code and choose an action, powered by DeepSeek.</p>
        </header>

        <main className="main-content">
          {/* Left Side: Code Input and Controls */}
          <div className="card input-card">
            <label htmlFor="codeInput" className="card-label">Your Code:</label>
            <textarea
              id="codeInput"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-textarea"
              placeholder="function example(arr) { ... }"
              disabled={isLoading}
            />
            
            <div className="actions-grid">
              <button onClick={() => handleApiCall('explain')} disabled={isLoading} className="action-button btn-explain">Explain Code</button>
              <button onClick={() => handleApiCall('refactor')} disabled={isLoading} className="action-button btn-refactor">Refactor Code</button>
              <button onClick={() => handleApiCall('debug')} disabled={isLoading} className="action-button btn-debug">Debug Code</button>
              <button onClick={() => handleApiCall('translate')} disabled={isLoading} className="action-button btn-translate">Translate Code</button>
            </div>
          </div>

          {/* Right Side: AI Output */}
          <div className="card">
            <h2 className="card-label">AI Response:</h2>
            <div className="output-display">
              {isLoading && <p className="loading-text">🤖 DeepSeek is thinking...</p>}
              {error && <p className="error-text"><strong>Error:</strong> {error}</p>}
              {result && <pre>{result}</pre>}
              {!isLoading && !error && !result && <p className="placeholder-text">Your results will appear here...</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

