import React, { useRef, type ReactNode } from "react";
import { useSideBarstore } from "../store/sidebarstore";
import { useChatCanvas } from "../store/chatstore";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

const InfiniteCanvas = () => {
  const { chat } = useChatCanvas();
  const { isOpen: isSideBarOpen } = useSideBarstore();

  // state and ref of canvas
  const offsetRef = useRef({ x: 0, y: 0 });
  const worldDivRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 }); // ตำแหน่ง mouse ล่าสุด ใช้ useRef เพราะแค่เก็บค่า แต่ไม่ต้อง rerender ทำให้ ลื่น
  const panning = useRef(false);
  
  // object on canvas
  const objectsPos = useRef<{ [id: string]: { x: number, y: number } }>({});
  // initail objectsPos
  chat.chat_logs?.forEach(log => {
    objectsPos.current[log._id] = { x: log.position.x, y: log.position.y };
  })
  const draggingObject = useRef<string | null>(null);
  const objectDivRefs = useRef<{ [id: string]: HTMLDivElement}>({});

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
      offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
      worldDivRef.current!.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px)`;
    }
    else if (draggingObject.current) {
      const id = draggingObject.current;
      objectsPos.current[id] = {
        x: objectsPos.current[id].x + dx,
        y: objectsPos.current[id].y + dy,
      }
      objectDivRefs.current[id].style.left = `${objectsPos.current[id].x}px`;
      objectDivRefs.current[id]!.style.top = `${objectsPos.current[id].y}px`;
    }
  }

  const onMouseUp = () => {
    if(draggingObject.current) {
      const updatedXYChat = 
      { ...chat, 
        chat_logs: chat.chat_logs?.map((c) => 
          c._id === draggingObject.current ? 
            { ...c, position: { 
              x: objectsPos.current[draggingObject.current].x , 
              y: objectsPos.current[draggingObject.current].y 
            } } 
          : c 
        ) 
      }
      window.chat.updateChat(updatedXYChat);
    }
    draggingObject.current = null;
    panning.current = false;
  }

  const World = ({ children }: { children: ReactNode }) => {
    return (
      <div
        ref={worldDivRef}
      >
        {children}
      </div>
    )
  }

  interface MemoizedMarkdownProps {
    children?: string;
  }
  
  const MemoizedMarkdown: React.FC<MemoizedMarkdownProps> = React.memo(
    ({ children }) => {
      return (
        <ReactMarkdown
          children={children}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
      );
    },
  );

  return (
    <div 
      className={`w-full h-screen ${!isSideBarOpen ? "ml-15": "ml-50"} py-4 z-0 overflow-hidden relative`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseDown={(e) => handleMouseDown(e, "world")}
    >
      <button>Add Text</button>
      {/* World // World คือ canvas นั่นแหละ */}
      <World>
        {chat.chat_logs?.map((chatLog) => (
          <div
          ref={(el) => {
            if (el) {
              objectDivRefs.current[chatLog._id] = el;
            }
          }}
            key={chatLog._id}
            className="max-w-xl bg-[#4c4c4c] absolute flex flex-col gap-1 border-1 border-[#6a6a6a] p-2 rounded-xl"
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
            <div className="flex justify-end">
              <h1 className="flex bg-[#6a6a6a] py-1 px-2 rounded-md">{chatLog.input}</h1>
            </div>
            <div>
              <MemoizedMarkdown children={chatLog.response} />
            </div>
          </div>
        ))}
      </World>
    </div>
  )
}

export default InfiniteCanvas;

/* 
note ใช้ useRef แทนถ้าค่าที่ render ไม่เปลี่ยน ใช้ usestate แค่ตอนเปลี่ยน text ก็พอ
เปลี่ยน style ถ้าใช้ useState rerender บ่อยจะ lag ให้ useRef เปลี่ยน ไม่ lag เลย
*/