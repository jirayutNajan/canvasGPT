// db.js
import Loki from 'lokijs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนด path ของไฟล์ DB
const dbPath = path.join(__dirname, 'app.db');
// TODO ตอนจะ build app
// const dbPath = path.join(app.getPath('userData'), 'app.db');

// สร้าง DB
const db = new Loki(dbPath, {
  autosave: true,      // บันทึกอัตโนมัติ
  autosaveInterval: 5000, // ทุก 5 วินาที
  autoload: true,      // โหลด DB ตอนเริ่ม
  autoloadCallback: databaseInitialize
});

function databaseInitialize() {
  // สร้าง collection ถ้ายังไม่มี
  let chats = db.getCollection('chats');
  if (!chats) {
    chats = db.addCollection('chats', { indices: ['_id'] });
  }
}

export default db;