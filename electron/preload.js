// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ping: (msg) => {
  //   console.log('ping called', msg);
  //   return ipcRenderer.invoke('ping', msg);
  // }
  saveAPIKey: (key) => ipcRenderer.invoke('save-api-key', key),
  hasAPIKey: () => ipcRenderer.invoke('has-api-key')
});

contextBridge.exposeInMainWorld('chat', {
  getChats: () => ipcRenderer.invoke('chats-get'),
  getChat: (_id) => ipcRenderer.invoke('chats-getOne', _id),
  addChat: (chat) => ipcRenderer.invoke('chats-add', chat),
  updateChat: (chat) => ipcRenderer.invoke('chats-update', chat),
  updateChatNotSave: (chat) => ipcRenderer.invoke('chats-update-not-save', chat),
  deleteChat: (_id) => ipcRenderer.invoke('chats-delete', _id)
});