import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatWindow from './ChatWindow';
import ModelSelector from './ModelSelector';

function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  useEffect(() => {
    // Load chats from local storage or API
    const savedChats = JSON.parse(localStorage.getItem('chats')) || [];
    setChats(savedChats);
    if (savedChats.length > 0) {
      setCurrentChat(savedChats[0]);
    }
  }, []);

  useEffect(() => {
    // Save chats to local storage
    localStorage.setItem('chats', JSON.stringify(chats));
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
    // For this example, we'll just simulate a response
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

  return (
    <div className="chat-interface">
      <ChatHistory 
        chats={chats} 
        currentChat={currentChat} 
        onSelectChat={setCurrentChat} 
        onCreateNewChat={createNewChat} 
      />
      <div className="chat-main">
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={setSelectedModel} 
        />
        <ChatWindow 
          currentChat={currentChat} 
          selectedModel={selectedModel} 
          onSendMessage={sendMessage} 
        />
      </div>
    </div>
  );
}

export default ChatInterface;
