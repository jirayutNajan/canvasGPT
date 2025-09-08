import React, { useRef, type ReactNode } from "react";
import { useSideBarstore } from "../store/sidebarstore";
import { useChatCanvas } from "../store/chatstore";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import SvgLine from "./SvgLine";
import ZoomButton from "./ZoomButton";

const InfiniteCanvas = () => {
  const { chat } = useChatCanvas();
  const { isOpen: isSideBarOpen } = useSideBarstore();

  // state and ref of canvas
  const offsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const worldDivRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 }); // ตำแหน่ง mouse ล่าสุด ใช้ useRef เพราะแค่เก็บค่า แต่ไม่ต้อง rerender ทำให้ ลื่น
  const panning = useRef(false);
  
  // object on canvas
  const objectsPos = useRef<{ [id: number]: { x: number, y: number } }>({});

  // initail objectsPos
  chat.chat_logs?.forEach(log => {
    objectsPos.current[log._id] = { x: log.position.x, y: log.position.y };
  })
  const draggingObject = useRef<number | null>(null);
  const objectDivRefs = useRef<{ [id: string]: HTMLDivElement}>({});

  const handleMouseDown = (e: React.MouseEvent, type: "world" | "object", id?: number) => {
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
    console.log(zoomRef.current)
    console.log(zoomRef.current + 1)
    let dx = (e.clientX - lastPos.current.x);
    let dy = (e.clientY - lastPos.current.y);

    lastPos.current = { x: e.clientX, y: e.clientY };

    if(panning.current) {
      offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
      worldDivRef.current!.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${zoomRef.current})`;
    }
    else if (draggingObject.current) {
      dx *= 1/zoomRef.current;  
      dy *= 1/zoomRef.current;

      const id = draggingObject.current;
      objectsPos.current[id] = {
        x: objectsPos.current[id].x + dx,
        y: objectsPos.current[id].y + dy,
      }
      objectDivRefs.current[id]!.style.transform = `translate(${objectsPos.current[id].x}px, ${objectsPos.current[id].y}px)`
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    let newScale = zoomRef.current;
    if(e.deltaY < 0) newScale += 0.05;
    else newScale -= 0.05;
    
    newScale = Math.min(Math.max(newScale, 0.2), 1.5);
    zoomRef.current = newScale;

    worldDivRef.current!.style.transform = 
      `scale(${zoomRef.current}) translate(${offsetRef.current.x}px, ${offsetRef.current.y}px)`;
    worldDivRef.current!.style.transformOrigin = "center center";
  }

  const World = ({ children }: { children: ReactNode }) => {
    return (
      <div
        // className="pointer-events-none"
        ref={worldDivRef}
      >
        {children}
      </div>
    )
  }

  return (
    <div 
      className={`w-full h-screen ${!isSideBarOpen ? "pl-15": "pl-50"} py-4 -z-10 overflow-hidden absolute`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseDown={(e) => {e.preventDefault();handleMouseDown(e, "world")}}
      onWheel={handleWheel}
    >
      <ZoomButton 
        zoomRef={zoomRef} 
        worldDivRef={worldDivRef}
        offsetRef={offsetRef}
      />
      {/* World // World คือ canvas นั่นแหละ */}
      <World>
        {/* <SvgLine /> */}
        {/* object */}
        {chat.chat_logs?.map((chatLog) => (
          <div
            ref={(el) => {
              if (el) {
                objectDivRefs.current[chatLog._id] = el;
              }
            }}
            key={chatLog._id}
            className="w-xl bg-[#4c4c4c] absolute flex flex-col gap-1 border-1 border-[#6a6a6a] p-2 rounded-xl
            cursor-grab"
            style={{
              transform: `translate(${chatLog.position.x}px, ${chatLog.position.y}px)`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation() // กันไม่ให้กดโดน world
              if(!e.altKey) {
                handleMouseDown(e, "object", chatLog._id);
              }
            }}
          >
            <div 
              className="cursor-auto"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <h1 className="flex bg-[#6a6a6a] py-1 px-2 rounded-md">{chatLog.input}</h1>
              </div>
              <div>
                <ReactMarkdown
                  children={chatLog.response}
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                />
              </div>
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