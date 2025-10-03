// src/components/CodeInput.jsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeInput = ({ onExplain, onVisualize, loading }) => {
  const [code, setCode] = useState('');

  return (
    <div className="code-input-container">
      <div className="editor-wrapper">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="code-textarea"
          spellCheck="false"
        />
        <SyntaxHighlighter language="javascript" style={atomDark} className="code-highlighter">
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="button-group">
        <button onClick={() => onExplain(code)} disabled={loading} className="action-button">
          {loading ? 'Analyzing...' : 'Explain'}
        </button>
        <button onClick={() => onVisualize(code)} disabled={loading} className="action-button">
          {loading ? 'Visualizing...' : 'Visualize'}
        </button>
      </div>
    </div>
  );
};

export default CodeInput;