import React, { useState } from 'react';
import './ChatHistory.css';

function ChatHistory({ 
  chats, 
  folders,
  currentChat, 
  onSelectChat, 
  onCreateNewChat, 
  onDeleteChat, 
  onRenameChat, 
  onRenameFolder,
  onCreateFolder 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editName, setEditName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(['root']);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleFolderRename = (folderId) => {
    if (editName.trim()) {
      onRenameFolder(folderId, editName.trim());
      setEditingFolderId(null);
      setEditName('');
    }
  };

  const handleFolderDoubleClick = (e, folder) => {
    e.stopPropagation();
    if (folder.id !== 'root') {
      setEditingFolderId(folder.id);
      setEditName(folder.name);
    }
  };

  const renderFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    const subFolders = folders.filter(f => f.parentId === folderId);
    const folderChats = chats.filter(chat => chat.folderId === folderId);
    
    return (
      <div key={folderId} className="folder">
        <div 
          className="folder-header"
          onClick={() => toggleFolder(folderId)}
          onDoubleClick={(e) => handleFolderDoubleClick(e, folder)}
        >
          <span className="folder-icon">
            {expandedFolders.includes(folderId) ? '▼' : '▶'}
          </span>
          {editingFolderId === folderId ? (
            <input
              className="folder-rename-input"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => handleFolderRename(folderId)}
              onKeyPress={(e) => e.key === 'Enter' && handleFolderRename(folderId)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            folder.name
          )}
          {folder.id !== 'root' && (
            <button 
              className="new-chat-button"
              onClick={(e) => {
                e.stopPropagation();
                onCreateNewChat(folderId);
              }}
            >
              +
            </button>
          )}
        </div>
        
        {expandedFolders.includes(folderId) && (
          <div className="folder-content">
            {subFolders.map(subFolder => renderFolder(subFolder.id))}
            {folderChats.map(chat => (
              <div 
                key={chat.id} 
                className={`chat-item-container ${currentChat?.id === chat.id ? 'selected' : ''}`}
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
                  <>
                    <div 
                      className="chat-item"
                      onClick={() => onSelectChat(chat)}
                    >
                      {chat.name}
                    </div>
                    <div className="menu-container">
                      <button 
                        className="menu-button"
                        onClick={(e) => handleMenuClick(e, chat.id)}
                      >
                        ⋮
                      </button>
                      {menuOpenId === chat.id && (
                        <div className="menu-dropdown">
                          <button onClick={(e) => handleRenameClick(e, chat)}>
                            Rename
                          </button>
                          <button onClick={(e) => handleDeleteClick(e, chat.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSaveRename = (chatId) => {
    if (editName.trim()) {
      onRenameChat(chatId, editName.trim());
      setEditingId(null);
    }
  };

  const handleMenuClick = (e, chatId) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === chatId ? null : chatId);
  };

  const handleRenameClick = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditName(chat.name);
    setMenuOpenId(null);
  };

  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation();
    onDeleteChat(chatId);
    setMenuOpenId(null);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  return (
    <div className="chat-history">
      <div className="chat-controls">
        {showNewFolderInput ? (
          <div className="new-folder-input">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter user name..."
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
            <button onClick={handleCreateFolder}>Add</button>
            <button onClick={() => setShowNewFolderInput(false)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowNewFolderInput(true)}>New User</button>
        )}
      </div>
      {renderFolder('root')}
    </div>
  );
}

export default ChatHistory;
