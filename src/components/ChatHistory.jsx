import React from 'react';

function ChatHistory({ chats, currentChat, onSelectChat, onCreateNewChat }) {
  return (
    <div className="chat-history">
      <button onClick={onCreateNewChat}>New Chat</button>
      <ul>
        {chats.map((chat) => (
          <li 
            key={chat.id} 
            className={chat.id === currentChat?.id ? 'active' : ''}
            onClick={() => onSelectChat(chat)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
