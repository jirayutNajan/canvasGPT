import { useRef, useState, type ReactNode } from "react";
import { useSideBarstore } from "../store/sidebarstore";
import { useChatCanvas } from "../store/chatstore";

// TODO เปลี่ยน index เป็น _id: uuid ของ chatlog และ สร้าง id
const InfiniteCanvas = () => {
  const { chat, setChat } = useChatCanvas();

  // state and ref of canvas
  const [offset, setOffSet] = useState({ x: 0, y: 0 });;
  const lastPos = useRef({ x: 0, y: 0 }); // ตำแหน่ง mouse ล่าสุด ใช้ useRef เพราะแค่เก็บค่า แต่ไม่ต้อง rerender ทำให้ ลื่น
  const panning = useRef(false);
  
  // object on canvas
  // const [chatLogs, setChatLogs] = useState<ChatLog[]>(chat.chat_logs || []);
  const draggingObject = useRef<string | null>(null);

  const { isOpen: isSideBarOpen } = useSideBarstore();

  const handleMouseDown = (e: React.MouseEvent, type: "world" | "object", id?: string) => {
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (type == "object") {
      if(!id) return;
      draggingObject.current = id;
    }
    else if(type == "world") {
      panning.current = true;
    }
  }
  
  const onMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    if(panning.current) {
      setOffSet((o) => ({ x: o.x + dx, y: o.y + dy })); // o, b คือ prev state
    }
    else if (draggingObject.current) {
      setChat({
        ...chat,
        chat_logs: chat.chat_logs?.map((c) => 
          c._id === draggingObject.current ? { ...c, position: { x: c.position.x + dx, y: c.position.y + dy } } : c
        )
      })
      window.chat.updateChat(chat);
    }
  }

  const onMouseUp = () => {
    draggingObject.current = null;
    panning.current = false;
  }

  const World = ({ children }: { children: ReactNode }) => {
    return (
      <div
        className="bg-gray-500 w-full h-screen"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onMouseDown={(e) => handleMouseDown(e, "world")}
      >
        {children}
      </div>
    )
  }

  return (
    <div 
      className={`w-full h-screen ${!isSideBarOpen ? "ml-15": "ml-50"} py-4 z-0 overflow-hidden relative`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <button>Add Text</button>
      {/* World // World คือ canvas นั่นแหละ */}
      <World>
        {chat.chat_logs?.map((chatLog) => (
          <div 
            key={chatLog._id}
            className="max-w-md bg-red-500 absolute" 
            style={{
              left: chatLog.position.x,
              top: chatLog.position.y
            }}
            onMouseDown={(e) => {
              e.stopPropagation() // กันไม่ให้กดโดน world
              if(!e.altKey) {
                handleMouseDown(e, "object", chatLog._id);
              }
              else {
                console.log('yes')
              }
            }}
          >
            <h1>{chatLog.input}</h1>
            <h1>{chatLog.response}</h1>
          </div>
        ))}
      </World>
    </div>
  )
}

export default InfiniteCanvas;