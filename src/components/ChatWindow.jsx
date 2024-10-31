import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import MessageFormatter from './MessageFormatter';
import './ChatWindow.css';

function ChatWindow({ currentChat, selectedModel, onSendMessage, onSelectModel }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, selectedModel);
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
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
