import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatWindow from './ChatWindow';
import { saveMessages, loadMessages, clearMessages } from '../services/storageService';

function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  useEffect(() => {
    // Load chats from IndexedDB
    const loadChats = async () => {
      try {
        const savedChats = await loadMessages();
        setChats(savedChats);
        if (savedChats.length > 0) {
          setCurrentChat(savedChats[0]);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      }
    };
    loadChats();
  }, []);

  useEffect(() => {
    // Save chats to IndexedDB
    const saveChats = async () => {
      try {
        await saveMessages(chats);
      } catch (error) {
        console.error('Error saving chats:', error);
      }
    };
    saveChats();
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: `Chat ${chats.length + 1}`,
      messages: []
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat);
  };

  const sendMessage = (message, model) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      messages: [
        ...currentChat.messages,
        { role: 'user', content: message }
      ]
    };

    // Here you would typically send the message to your API
    // and wait for a response before updating the chat
    setTimeout(() => {
      updatedChat.messages.push({
        role: 'assistant',
        content: `This is a simulated response from ${model}.`
      });
      updateChat(updatedChat);
    }, 1000);

    updateChat(updatedChat);
  };

  const updateChat = (updatedChat) => {
    setCurrentChat(updatedChat);
    setChats(chats.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    ));
  };

  const clearAllChats = async () => {
    try {
      await clearMessages();
      setChats([]);
      setCurrentChat(null);
    } catch (error) {
      console.error('Error clearing chats:', error);
    }
  };

  const renameChat = (chatId, newName) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, name: newName }
        : chat
    );
    setChats(updatedChats);
    if (currentChat?.id === chatId) {
      setCurrentChat({ ...currentChat, name: newName });
    }
  };

  return (
    <div className="chat-interface">
      <ChatHistory 
        chats={chats} 
        currentChat={currentChat}
        onSelectChat={setCurrentChat}
        onCreateNewChat={createNewChat}
        onClearChats={clearAllChats}
        onRenameChat={renameChat}
      />
      <ChatWindow 
        currentChat={currentChat}
        selectedModel={selectedModel}
        onSendMessage={sendMessage}
        onSelectModel={setSelectedModel}
      />
    </div>
  );
}

export default ChatInterface;