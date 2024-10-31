import React from 'react';

function ModelSelector({ selectedModel, onSelectModel }) {
  return (
    <select 
      value={selectedModel} 
      onChange={(e) => onSelectModel(e.target.value)}
      className="model-selector"
    >
      <option value="no-model">No Model</option>
      <option value="gpt-3.5-turbo">GPT-3.5</option>
      <option value="gpt-4">GPT-4</option>
      <option value="claude-3-opus">Claude 3 Opus</option>
      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
    </select>
  );
}

export default ModelSelector;
