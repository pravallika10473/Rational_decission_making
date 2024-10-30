import React, { useState } from 'react';
import './ChatHistory.css';

function ChatHistory({ chats, currentChat, onSelectChat, onCreateNewChat, onClearChats, onRenameChat }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleDoubleClick = (chat) => {
    setEditingId(chat.id);
    setEditName(chat.name);
  };

  const handleSaveRename = (chatId) => {
    if (editName.trim()) {
      onRenameChat(chatId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="chat-history">
      <div className="chat-controls">
        <button onClick={onCreateNewChat}>New Chat</button>
        <button onClick={onClearChats}>Clear Chats</button>
      </div>
      <ul>
        {chats.map((chat) => (
          <li 
            key={chat.id} 
            className={chat.id === currentChat?.id ? 'active' : ''}
          >
            {editingId === chat.id ? (
              <div className="rename-input">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveRename(chat.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveRename(chat.id)}
                  autoFocus
                />
              </div>
            ) : (
              <div 
                className="chat-item"
                onClick={() => onSelectChat(chat)}
                onDoubleClick={() => handleDoubleClick(chat)}
              >
                {chat.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
