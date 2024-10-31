import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatWindow from './ChatWindow';
import { saveMessages, loadMessages, clearMessages, saveFolders, loadFolders } from '../services/storageService';
import { getChatCompletion } from '../services/chatService';

function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [systemMessage, setSystemMessage] = useState("You are a helpful assistant.");
  const [folders, setFolders] = useState([
    { id: 'root', name: 'Users', parentId: null },
  ]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [savedChats, savedFolders] = await Promise.all([
          loadMessages(),
          loadFolders()
        ]);
        setChats(savedChats);
        setFolders(savedFolders);
        if (savedChats.length > 0) {
          setCurrentChat(savedChats[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadInitialData();
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

  const createNewFolder = (folderName) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: folderName,
      parentId: 'root'
    };
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
  };

  const createNewChat = (folderId) => {
    if (!folderId || folderId === 'root') {
      alert('Please select a user folder first');
      return;
    }

    const survivalTask = `You and your companions have just survived the crash of a small plane. Both the pilot and co-pilot were killed in the crash. It is mid-January and you are in Northern Canada. The daily temperature is zero and the night time temperature is below zero. There is snow on the ground and the countryside contains several creeks criss-crossing the area. The nearest town is 35 kilometres away. You are all dressed in city clothes appropriate for a business meeting.

Your group of survivors managed to salvage the following items:
1. A ball of steel wool
2. A small axe
3. A loaded pistol
4. Can of vegetable oil
5. Newspapers (one per person)
6. Cigarette lighter (without fluid)
7. Extra shirt and pants for each survivor
8. 20 x 20 ft. piece of heavy-duty canvas
9. An air map made of plastic
10. Some whiskey
11. A compass
12. Family-size chocolate bars (one per person)

Your task as a group is to list the above 12 items in order of importance for your survival. List the uses for each. You will be required to come to agreement as a group and describe why you prioritized each item as you did.`;

    const newChat = {
      id: Date.now(),
      name: `Survival Task ${chats.filter(chat => chat.folderId === folderId).length + 1}`,
      folderId: folderId,
      messages: [
        {
          role: 'assistant',
          content: survivalTask
        }
      ]
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

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (currentChat?.id === chatId) {
      setCurrentChat(updatedChats[0] || null);
    }
  };

  const handleRenameFolder = (folderId, newName) => {
    const updatedFolders = folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, name: newName }
        : folder
    );
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
  };

  return (
    <div className="chat-interface">
      <ChatHistory 
        chats={chats} 
        folders={folders}
        currentChat={currentChat}
        onSelectChat={setCurrentChat}
        onCreateNewChat={createNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={renameChat}
        onRenameFolder={handleRenameFolder}
        onCreateFolder={createNewFolder}
      />
      <ChatWindow 
        currentChat={currentChat}
        selectedModel={selectedModel}
        systemMessage={systemMessage}
        onSystemMessageChange={setSystemMessage}
        onSendMessage={sendMessage}
        onSelectModel={setSelectedModel}
      />
    </div>
  );
}

export default ChatInterface;