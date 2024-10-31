import React from 'react';

function ModelSelector({ selectedModel, onSelectModel }) {
  const models = [
    'gpt-4o',
    'gpt-4',
    'claude-2.1'
  ];

  return (
    <select 
      value={selectedModel} 
      onChange={(e) => onSelectModel(e.target.value)}
    >
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}

export default ModelSelector;
