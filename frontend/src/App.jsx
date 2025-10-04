import React, { useState } from 'react';
import './App.css';
// Import the centralized API call function
import { callApi } from './services/api';

export default function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      if (action === 'translate') {
        const targetLanguage = prompt("Enter the language to translate the code to:", "Python");
        if (!targetLanguage) {
          setIsLoading(false);
          return; // User cancelled
        }
        requestBody.targetLanguage = targetLanguage;
      }

      // Use the imported function to make the API call
      const data = await callApi(action, requestBody);
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