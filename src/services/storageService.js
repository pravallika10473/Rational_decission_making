import { openDB } from 'idb';

const dbName = 'chatDB';
const storeName = 'chatHistory';

const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    },
  });
  return db;
};

export const saveMessages = async (messages) => {
  const db = await initDB();
  await db.put(storeName, messages, 'messages');
};

export const loadMessages = async () => {
  const db = await initDB();
  return await db.get(storeName, 'messages') || [];
};

export const clearMessages = async () => {
  const db = await initDB();
  await db.delete(storeName, 'messages');
}; 