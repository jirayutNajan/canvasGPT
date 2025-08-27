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

contextBridge.exposeInMainWorld('chatsDB', {
  insert: (doc) => ipcRenderer.invoke('chats-insert', doc),
  find: (query = {}, projection = null) => ipcRenderer.invoke('chats-find', query, projection)
})