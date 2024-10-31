import React from 'react';

function ModelSelector({ selectedModel, onSelectModel }) {
  return (
    <select 
      value={selectedModel} 
      onChange={(e) => onSelectModel(e.target.value)}
      className="model-selector"
    >
      <option value="no-model">No Model</option>
      <option value="gpt-4o">GPT-4o</option>
      <option value="gpt-4">GPT-4</option>
      <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
    </select>
  );
}

export default ModelSelector;
