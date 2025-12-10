import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db/db.js';
import getOpenAiClient, { resetClient } from './services/openAiService.js';
import Store from 'electron-store'

// สำหรับ ES Module path ต้องแปลง __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged
let win

// renderer หมายถึง ส่วนของ react
function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // ป้องกัน renderer เข้าถึง node api โดยตรง
      nodeIntegration: false, // ป้องกัน react ใช้ node api โดยตรง
      sandbox: true// เพิ่มความปลอดถัย
    }
  })

  // dev ให้ win โหลดจาก localhost, build ให้โหลดจาก build
  if(isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' })
  }
  else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // ถ้ามี link ให้เปิดใน browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if(process.platform !== "darwin") app.quit()
})


const store = new Store({ encryptionKey: "2wwqnCQOAlaVN3BSRoDKvIrC2HnwElUZ+JNdPQEMSLA=" })

ipcMain.handle('save-api-key', async(_evt, key) => {
  store.set('apiKey', key)
  resetClient(); // Reset client so it uses the new API key
})

ipcMain.handle('change-api-key', async(_evt, key) => {
  store.set('apiKey', key)
  resetClient(); // Reset client so it uses the new API key
})

ipcMain.handle('has-api-key', async(_evt) => {
  const key = store.get('apiKey');
  return !!key
})

ipcMain.handle('chats-get', () => {
  const chats = db.getCollection('chats').chain().simplesort('$loki', true).data();
  return chats;
})

ipcMain.handle('chats-getOne', (_evt, _id) => {
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return null;
  return existing;
})

ipcMain.handle('chats-add', (_evt, chat) => {
  const chats = db.getCollection('chats');
  const newChat = chats.insert(chat);
  db.saveDatabase();
  return newChat;
})

ipcMain.handle('chats-update', (_evt, _id, chatLogs) => {
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return null;
  chats.update({...existing, chat_logs: chatLogs})
  db.saveDatabase();
})

ipcMain.handle('chats-delete', (_evt, _id) => {
  _id = Number(_id);
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return false;
  chats.remove(existing);
  db.saveDatabase();
  return true;
})

ipcMain.handle('chats-update-zoom', (_evt, _id, zoomScale) => {
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return
  chats.update({...existing, zoomScale})
})

ipcMain.handle('chats-update-offset', (_evt, _id, offset) => {
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return
  chats.update({...existing, offset})
})

ipcMain.handle('chats-chatLog-x-y', (_evt, _id, chatLogId, position) => {
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return null;
  existing.chat_logs[chatLogId].position = position;
  chats.update(existing);
  db.saveDatabase();
})

ipcMain.handle('chats-add-ChatLog', (_evt, _id, newChatLog) => {
  const chats = db.getCollection('chats');
  const existing = chats.findOne({ $loki: Number(_id) });
  if(!existing) return;
  existing.chat_logs.push(newChatLog);
  if(newChatLog.parent[0] != null) existing.chat_logs[newChatLog.parent[0]].child.push(newChatLog._id)
  chats.update(existing)
  db.saveDatabase()
})

ipcMain.handle('openai-response', async (_evt, chatLog, input) => {
  // const messages = []
  // chatLog.map(log => {
  //   if(log.input){
  //     messages.push(
  //       {
  //       role: "user",
  //       content: log.input
  //     }
  //     )
  //   }
  //   if(log.response) {
  //   messages.push(
  //     {
  //       role: "assistant",
  //       content: log.response
  //     }
  //   )
  //   }
  // })

  // messages.push({role: "user", content: input})

  // const client = getOpenAiClient();
  // const response = await client.responses.create({
  //   model: "gpt-5-nano",
  //   input: messages,
  //   store: false,
  //   // reasonging: { effort: "medium" }
  // })

  // return response;

  const waiteiei = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 500);
  })

  await waiteiei;

  return "wowo"
})