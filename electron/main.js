import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import keytar from 'keytar'
import Datastore from 'nedb';

// สำหรับ ES Module path ต้องแปลง __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// db collection
const chatsDB = new Datastore({ filename: path.join(__dirname, 'db', 'chats.db'), autoload: true })
chatsDB.ensureIndex({ fieldName: 'createdAt' });

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


// ipcMain.handle('ping', (_evt, msg) => {
//   return `pong: ${msg}`
// })

const SERVICE = 'canvasGPT';
const ACCOUNT = 'OpenAI';

ipcMain.handle('save-api-key', async(_evt, key) => {
  await keytar.setPassword(SERVICE, ACCOUNT, key);
  return true;
})

ipcMain.handle('has-api-key', async(_evt) => {
  const key = await keytar.getPassword(SERVICE, ACCOUNT);
  return !!key;
})

ipcMain.handle('chats-insert', async (_evt, doc) => {
  return new Promise((resolve, reject) => {
    chatsDB.insert(doc, (err, newDoc) => {
      if (err) reject(err);
      else resolve(newDoc);
    })
  })
})

ipcMain.handle('chats-find', async (_evt, query = {}, projection = null) => {
  return new Promise((resolve, reject) => {
    let cursor = chatsDB.find(query);
    if(projection) cursor = cursor.projection(projection);
    cursor.exec((err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    })
  })
})