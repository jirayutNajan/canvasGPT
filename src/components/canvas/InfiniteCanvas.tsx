import React, { useRef, useState, type ReactNode, useEffect } from "react";
import { useSideBarstore } from "../../store/sidebarstore";
import { useChatCanvas } from "../../store/chatstore";
import ZoomButton from "./ZoomButton";
import ChatBox from "./ChatBox";
import type { Chat, ChatLog } from "../../interface/ChatInterface";

const InfiniteCanvas = () => {
  const { chat, setChat } = useChatCanvas();
  const { isOpen: isSideBarOpen } = useSideBarstore();
  const [mounted, setMounted] = useState(false);

  // state and ref of canvas
  const offsetRef = useRef({ x: chat.offset?.x || 0, y: chat.offset?.y || 0 });
  const zoomRef = useRef(chat?.zoomScale || 1);
  const worldDivRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 }); // ตำแหน่ง mouse ล่าสุด ใช้ useRef เพราะแค่เก็บค่า แต่ไม่ต้อง rerender ทำให้ ลื่น
  const panning = useRef(false);
  
  // object on canvas
  const objectsPos = useRef<{ [id: number]: { x: number, y: number } }>({});
  // initail objectsPos
  chat.chat_logs?.forEach(log => {
    objectsPos.current[log._id] = { x: log.position.x, y: log.position.y };
  })

  const objectDivRefs = useRef<{ [id: number]: HTMLDivElement}>({});
  const draggingObject = useRef<number | null>(null);
  const svgRefs = useRef<{ [id: number]: SVGSVGElement }>({})
  const pathRefs = useRef<{ [id: number]: SVGPathElement }>({})

  const objectRefs = useRef<{
    [id: number]: {
      chatBox: HTMLDivElement,
      svg: SVGSVGElement | null,
      path: SVGPathElement | null
    }
  }>({});

  const setObjectRefs = (id: number, chatBoxRef: HTMLDivElement, svg: SVGSVGElement | null, path: SVGPathElement | null) => {
    objectRefs.current[id] = {
      chatBox: chatBoxRef,
      svg: svg,
      path: path
    }
  }

  const setSvgRefs = (id: number, ref: SVGSVGElement) => {
    svgRefs.current[id] = ref
  }

  const setPathRefs = (id: number, ref: SVGPathElement) => {
    pathRefs.current[id] = ref
  }

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
    let dx = (e.clientX - lastPos.current.x);
    let dy = (e.clientY - lastPos.current.y);

    lastPos.current = { x: e.clientX, y: e.clientY };

    if(panning.current) {
      offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
      worldDivRef.current!.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${zoomRef.current})`;
    }
    else if (draggingObject.current) {
      const id = draggingObject.current;
      dx *= 1/zoomRef.current;  
      dy *= 1/zoomRef.current;

      objectsPos.current[id] = {
        x: objectsPos.current[id].x + dx,
        y: objectsPos.current[id].y + dy,
      }

      objectDivRefs.current[id]!.style.transform = `translate(${objectsPos.current[id].x}px, ${objectsPos.current[id].y}px)`
    }
  }

  const onMouseUp = async () => {
    if(draggingObject.current) {
      // old version
      /*
      const updatedXYChat: Chat = 
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
      */
      const updatedXYChat: Chat = 
      { ...chat, 
        chat_logs: chat.chat_logs?.map((c) => 
          ({
            ...c,
            position: objectsPos.current[c._id]
          })
        ) 
      }

      // setChat(updatedXYChat)
      window.chat.updateChat(updatedXYChat)
      // pathRefs.current[draggingObject.current].style.stroke = "red"
      const svg = svgRefs.current[draggingObject.current]
      if(svg) {
        svg.querySelector("path")!.style.stroke = "red" 
      }
    }
    else {
      window.chat.updateChatNotSave({...chat, offset: offsetRef.current })
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

    window.chat.updateChatNotSave({...chat, zoomScale: zoomRef.current })
  }
  
  const World = ({ children }: { children: ReactNode }) => { 
    return ( 
      <div 
        ref={worldDivRef} 
        style={{
          transform: `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${zoomRef.current})`
        }}
      >
        {children} 
      </div> ) 
  }

  useEffect(() => {
    setMounted(true);
  }, [])

  // console.log("first page rerender");

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
        {/* object */}
        {chat.chat_logs?.map((chatLog) => (
          <ChatBox 
            chatLog={chatLog} 
            key={chatLog._id} 
            ref={(el) => {
              if (el) objectDivRefs.current[chatLog._id] = el
            }}
            objectHeight={objectDivRefs.current[chatLog._id]?.offsetHeight}
            handleMouseDown={handleMouseDown}
            objectDivRefs={objectDivRefs}
            objectsPos={objectsPos}
            setSvgRefs={setSvgRefs}
            setPathRefs={setPathRefs}
            setObjectRefs={setObjectRefs}
          />
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