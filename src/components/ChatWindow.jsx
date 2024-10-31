import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import MessageFormatter from './MessageFormatter';
import './ChatWindow.css';

function ChatWindow({ 
  currentChat, 
  selectedModel, 
  systemMessage,
  onSystemMessageChange,
  onSendMessage, 
  onSelectModel 
}) {
  const [message, setMessage] = useState('');
  const [showSystemMessage, setShowSystemMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, selectedModel);
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="system-message-container">
        <button 
          className="system-message-toggle"
          onClick={() => setShowSystemMessage(!showSystemMessage)}
        >
          {showSystemMessage ? 'Hide System Message' : 'Show System Message'}
        </button>
        {showSystemMessage && (
          <div className="system-message">
            <textarea
              value={systemMessage}
              onChange={(e) => onSystemMessageChange(e.target.value)}
              placeholder="Enter system message..."
              className="system-message-input"
            />
          </div>
        )}
      </div>
      <div className="messages">
        {currentChat?.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <MessageFormatter content={msg.content} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </div>
          <ModelSelector 
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
          />
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
