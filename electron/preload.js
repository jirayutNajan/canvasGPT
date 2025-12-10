// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiKey', {
  saveAPIKey: (key) => ipcRenderer.invoke('save-api-key', key),
  changeAPIKey: (key) => ipcRenderer.invoke('change-api-key', key),
  hasAPIKey: () => ipcRenderer.invoke('has-api-key')
});

contextBridge.exposeInMainWorld('chat', {
  getChats: () => ipcRenderer.invoke('chats-get'),
  getChat: (_id) => ipcRenderer.invoke('chats-getOne', _id),
  addChat: (chat) => ipcRenderer.invoke('chats-add', chat),
  updateChat: (_id, chatLogs) => ipcRenderer.invoke('chats-update', _id, chatLogs),
  deleteChat: (_id) => ipcRenderer.invoke('chats-delete', _id),
  updateChatZoomScale: (_id, zoomScale) => ipcRenderer.invoke("chats-update-zoom", _id, zoomScale),
  updateChatOffset: (_id, offset) => ipcRenderer.invoke("chats-update-offset", _id, offset),
  updateChatLogXY: (_id, chatLogId, position) => ipcRenderer.invoke("chats-chatLog-x-y", _id, chatLogId, position),
  addChatLog: (_id, newChatLog) => ipcRenderer.invoke("chats-add-ChatLog", _id, newChatLog),
});

contextBridge.exposeInMainWorld('chatGPT', {
  getChatResponse: (chatLog, input) => ipcRenderer.invoke('openai-response', chatLog, input)
})