import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatWindow from './ChatWindow';
import { saveMessages, loadMessages, clearMessages } from '../services/storageService';
import { getChatCompletion } from '../services/chatService';

function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [systemMessage, setSystemMessage] = useState("You are a helpful assistant.");

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

  const handleSystemMessageChange = (newMessage) => {
    setSystemMessage(newMessage);
  };

  const sendMessage = async (message, model) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      systemMessage: systemMessage,
      messages: [
        ...currentChat.messages,
        { role: 'user', content: message }
      ]
    };

    updateChat(updatedChat);

    try {
      const response = await getChatCompletion(model, updatedChat.messages, systemMessage);
      
      const chatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, response]
      };
      
      updateChat(chatWithResponse);
    } catch (error) {
      console.error('Error getting chat completion:', error);
      const chatWithError = {
        ...updatedChat,
        messages: [...updatedChat.messages, {
          role: 'assistant',
          content: error.message || 'Sorry, there was an error processing your request.'
        }]
      };
      updateChat(chatWithError);
    }
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
        systemMessage={systemMessage}
        onSystemMessageChange={handleSystemMessageChange}
        onSendMessage={sendMessage}
        onSelectModel={setSelectedModel}
      />
    </div>
  );
}

export default ChatInterface;