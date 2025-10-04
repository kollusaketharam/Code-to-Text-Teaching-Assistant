// src/components/ExplanationOutput.jsx
import React from 'react';

const ExplanationOutput = ({ explanation, error }) => {
  return (
    <div className="output-container">
      <h3>Explanation</h3>
      <div className="output-box">
        {error && <p className="error-text">{error}</p>}
        {explanation && <pre className="explanation-text">{explanation}</pre>}
        {!explanation && !error && <p className="placeholder-text">Your explanation will appear here...</p>}
      </div>
    </div>
  );
};

export default ExplanationOutput;