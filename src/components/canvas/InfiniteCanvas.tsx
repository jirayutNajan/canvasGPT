import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSideBarstore } from "../../store/sidebarstore";
import ZoomButton from "./ZoomButton";
import { useQueryClient } from "@tanstack/react-query";
import type { Chat } from "../../interface/ChatInterface";
import ChatBox from "./ChatBox";
import InputBox from "./InputBox";
import { IoMdAdd } from "react-icons/io";

const InfiniteCanvas = ({ chat }: { chat: Chat }) => {
  const queryClient = useQueryClient();

  const { isOpen: isSideBarOpen } = useSideBarstore();
  // const {}

  const [mounted, setMounted] = useState(false);
  const [isAddInput, setIsAddInput] = useState(false);

  // state and ref of canvas
  const offsetRef = useRef(chat.offset);
  const zoomRef = useRef(chat?.zoomScale || 1);
  const worldDivRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const panning = useRef(false);
  
  // object on canvas
  const objectsPos = useRef<{ [id: number]: { x: number, y: number } }>({});
  // initail objectsPos
  chat.chat_logs?.forEach(log => {
    objectsPos.current[log._id] = { x: log.position.x, y: log.position.y };
  })

  const draggingObject = useRef<number | null>(null);

  const objectsRefs = useRef<{ 
    [id: number]: { chatBox: HTMLDivElement | null, svg: SVGSVGElement | null, path: SVGPathElement | null }
  }>({});
  // useCallback ใช้สำหรับครอบฟังก์ชันไม่ให้สร้างใหม่
  // ใช้ตอนที่ฟังก์ชันนั้นใช้ใน memo
  const setObjectRefs = useCallback((
    { id, chatBoxRef, svg, path }: 
    { id: number, chatBoxRef: HTMLDivElement, svg: SVGSVGElement | null, path: SVGPathElement | null }
  ) => {
    objectsRefs.current[id] = {
      chatBox: chatBoxRef,
      svg: svg,
      path: path
    }
  }, [])


  // Ref ของ inputBox
  const inputRef = useRef<HTMLDivElement>(null);
  const setInputRef = useCallback((input: HTMLDivElement) => { 
    inputRef.current = input
  }, [])
  if(inputRef.current) {
    inputRef.current.style.scale = `${chat?.zoomScale}`
  }


  const handleMouseDown = useCallback((e: React.MouseEvent, type: "world" | "object", id?: number) => {
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (type == "object") {
      if(id == null) return;
      draggingObject.current = id;
    }
    else if(type == "world") {
      panning.current = true;
    }
  }, [])
  
  const onMouseMove = (e: React.MouseEvent) => {
    let dx = (e.clientX - lastPos.current.x);
    let dy = (e.clientY - lastPos.current.y);

    lastPos.current = { x: e.clientX, y: e.clientY };

    if(panning.current) {
      offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
      worldDivRef.current!.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${zoomRef.current})`;
    }
    else if (draggingObject.current != null) {
      const id = draggingObject.current;
      dx *= 1/zoomRef.current;  
      dy *= 1/zoomRef.current;

      objectsPos.current[id] = {
        x: objectsPos.current[id].x + dx,
        y: objectsPos.current[id].y + dy,
      }

      if(objectsRefs.current[id].chatBox) {
        objectsRefs.current[id].chatBox.style.transform = `translate(${objectsPos.current[id].x}px, ${objectsPos.current[id].y}px)`
      }
      if(chat.chat_logs[id].parent[0] != null) {
        calculateAndChangeSVGAndPath(id)
      }
      if(chat.chat_logs[id].child) {
        chat.chat_logs[id].child.forEach(id => {
          calculateAndChangeSVGAndPath(id)
        })
      }
    }
  }

  function calculateAndChangeSVGAndPath(id: number) {
    if(!chat.chat_logs) return;
    const parentId = chat.chat_logs[id]?.parent[0];
    if(parentId == null) return

    const thisObjectPos = objectsPos.current[id];
    const thisReferPos = objectsPos.current[parentId];
    const thisObject = objectsRefs.current[id].chatBox;
    const parentObject = objectsRefs.current[parentId].chatBox;

    if(!parentObject || !thisObject || !objectsRefs.current[id].svg || !objectsRefs.current[id].path) return;

    const width = Math.abs(thisObjectPos.x - thisReferPos.x);
    const height = Math.abs(Math.abs(thisObjectPos.y - thisReferPos.y) - parentObject?.offsetHeight)

    objectsRefs.current[id].svg.style.width = `${width}`;
    objectsRefs.current[id].svg.style.height = `${height}`;

    let pos: "tl" | "tr" | "bl" | "br";

    if(thisObjectPos.x < thisReferPos.x && thisObjectPos.y < thisReferPos.y) pos = "tl"
    else if(thisObjectPos.x > thisReferPos.x && thisObjectPos.y < thisReferPos.y) pos = "tr"
    else if(thisObjectPos.x < thisReferPos.x && thisObjectPos.y > thisReferPos.y) pos = "bl"
    else pos = "br"

    let path = "";
    let svgPos = "";
    if(pos === "bl" || pos === "tr") {
      if(pos === "bl") {
        svgPos = `translate(300px, -${height + 9}px)`
      }
      else {
        svgPos = `translate(${-width + 300}px, ${thisObject.offsetHeight - 7}px)`
      }

      path = `
      M 0 ${height}
      L 0 ${height*0.5 + 20}
      Q 0 ${height*0.5}
      20 ${height*0.5}
      L ${width - 20} ${height*0.5}
      Q ${width} ${height*0.5} ${width} ${height*0.5 - 20}
      L ${width} 0
      `
    }
    else {
      if(pos === "br") {
        svgPos = `translate(${-width + 300}px, -${height + 9}px)`
      }
      else {
        svgPos = `translate(300px, ${thisObject.offsetHeight - 7}px)`
      }

      path = `
      M 0 0
      L 0 ${height*0.5 - 20}
      Q 0 ${height*0.5} 20 ${height*0.5}
      L ${width - 20} ${height*0.5}
      Q ${width} ${height*0.5} ${width} ${height * 0.5 + 20}
      L ${width} ${height}
      `
    }

    objectsRefs.current[id].path.setAttribute("d", path);
    objectsRefs.current[id].svg.style.transform = svgPos;
  }

  const onMouseUp = () => {
    if(draggingObject.current != null) {
      if(chat.$loki) {
        window.chat.updateChatLogXY(chat.$loki, draggingObject.current, objectsPos.current[draggingObject.current])
        queryClient.setQueryData<Chat>(['chat', chat.$loki], (oldData: Chat | undefined) => {
          if(!oldData) return { name: "", chat_logs: [], newChatBoxPosition: { x: 0, y: 0 }, offset: { x: 0, y: 0 }}

          return {
            ...oldData,
            zoomScale: zoomRef.current,
            offset: offsetRef.current,
            chat_logs: chat.chat_logs.map(chatlog => (
              {
                ...chatlog,
                position: chatlog._id == draggingObject.current ? objectsPos.current[draggingObject.current] : chatlog.position
              }
            ))
          }
        })
      } 
    }
    else {
      if(chat.$loki) {
        window.chat.updateChatOffset(chat.$loki, offsetRef.current)
      } 
    }

    draggingObject.current = null;
    panning.current = false;
  }

  let wheelTimeout: NodeJS.Timeout;
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget.getBoundingClientRect();
    const centerX = container.width / 2;
    const centerY = container.height / 2;

    const oldScale = zoomRef.current;
    let newScale = oldScale;
    
    if (e.deltaY < 0) newScale += 0.05;
    else newScale -= 0.05;
    
    newScale = Math.min(Math.max(newScale, 0.2), 1.5);

    const scaleRatio = newScale / oldScale;
    
    const newOffsetX = centerX - (centerX - offsetRef.current.x) * scaleRatio;
    const newOffsetY = centerY - (centerY - offsetRef.current.y) * scaleRatio;

    zoomRef.current = newScale;
    offsetRef.current = { x: newOffsetX, y: newOffsetY };

    if (worldDivRef.current) {
        worldDivRef.current.style.transformOrigin = '0 0'; 
        worldDivRef.current.style.transform = `translate(${newOffsetX}px, ${newOffsetY}px) scale(${newScale})`;
    }

    if(inputRef.current) {
      inputRef.current.style.scale = `${newScale}`
      // ตอนเลื่อนไม่ต้องเห็น inputbox
      inputRef.current.style.transform = `translate(-500px, -500px)`
    }

    clearTimeout(wheelTimeout)
    wheelTimeout = setTimeout(() => {
      if(chat.$loki) {
        window.chat.updateChatOffset(chat.$loki, offsetRef.current)
        window.chat.updateChatZoomScale(chat.$loki, zoomRef.current)
      }
    }, 200)
  }
  
  useEffect(() => {
    setMounted(true);
    // เพิ่ม setTimeout เพื่อให้ refs มีเวลา set ค่า
  }, [])
  
  setTimeout(() => {
    if(chat.chat_logs) {
      chat.chat_logs.map(log => {
        if(log.parent) {
          calculateAndChangeSVGAndPath(log._id)
        } 
      })
    }
  }, 100)
  
  const [t, setT] = useState(0)

  return (
    <div 
      className={`w-full h-screen ${!isSideBarOpen ? "pl-15": "pl-50"} py-4 -z-10 overflow-hidden absolute active:cursor-grabbing`}
      onMouseMove={(e) => {if(!isAddInput) onMouseMove(e)}}
      onMouseUp={onMouseUp}
      onMouseDown={(e) => {e.preventDefault();handleMouseDown(e, "world")}}
      onWheel={handleWheel}
    >
      <div onClick={() => setT(t+1)}>
        {t}
      </div>
      <ZoomButton 
        zoomRef={zoomRef} 
        worldDivRef={worldDivRef}
        offsetRef={offsetRef}
      />
      {/* World */}
      <div 
        ref={ worldDivRef }
        style={{
          transformOrigin: '0 0',
          transform: `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${zoomRef.current})`
        }}
      >
        {chat.chat_logs?.map((chatLog) => (
          <ChatBox
            chatLog={chatLog} 
            key={chatLog._id} 
            handleMouseDown={handleMouseDown}
            setObjectRefs={setObjectRefs}
          />
        ))}
        {/* object */}
        {/* {isLoading && (
          <ChatBoxSkeleton position={{x: 100, y: 100}} input={input} />
          )
          } */}
      </div>
      <div className="flex flex-col justify-end h-full pb-5 items-center">
        <div 
          className="rounded-full bg-[#5b5b5b]"
          onClick={() => setIsAddInput((prev) => !prev)}
        >
          <IoMdAdd size={40} />
        </div>
      </div>
      {isAddInput && <InputBox setInputRef={setInputRef} scale={zoomRef.current} /> }
    </div>
  )
}

export default InfiniteCanvas;