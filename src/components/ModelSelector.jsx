import React from 'react';

function ModelSelector({ selectedModel, onSelectModel }) {
  const models = ['gpt-3.5-turbo', 'gpt-4', 'claude-v1', 'claude-v2'];

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
