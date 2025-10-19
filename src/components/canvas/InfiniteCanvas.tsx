import React, { useRef, useState, type ReactNode, useEffect } from "react";
import { useSideBarstore } from "../../store/sidebarstore";
import { useChatCanvas } from "../../store/chatstore";
import ZoomButton from "./ZoomButton";
import ChatBox from "./ChatBox";

const InfiniteCanvas = () => {
  const { chat } = useChatCanvas(); // TODO เอาอันนี้ออกแล้วรับมาจาก home
  const { isOpen: isSideBarOpen } = useSideBarstore();
  const [mounted, setMounted] = useState(false);
  // state and ref of canvas
  const offsetRef = useRef({ x: chat.offset?.x || 0, y: chat.offset?.y || 0 });
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

  const setObjectRefs = (
    {id, chatBoxRef, svg, path}: 
    {id: number, chatBoxRef: HTMLDivElement, svg: SVGSVGElement | null, path: SVGPathElement | null}
  ) => {
    objectsRefs.current[id] = {
      chatBox: chatBoxRef,
      svg: svg,
      path: path
    }
  }

  const handleMouseDown = (e: React.MouseEvent, type: "world" | "object", id?: number) => {
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (type == "object") {
      if(id == null) return;
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
      if(chat.$loki) window.chat.updateChatLogXY(chat.$loki, draggingObject.current, objectsPos.current[draggingObject.current])
    }
    else {
      if(chat.$loki) window.chat.updateChatOffset(chat.$loki, offsetRef.current)
    }

    draggingObject.current = null;
    panning.current = false;
  }

  let wheelTimeout: NodeJS.Timeout;
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    let newScale = zoomRef.current;
    if(e.deltaY < 0) newScale += 0.05;
    else newScale -= 0.05;
    
    newScale = Math.min(Math.max(newScale, 0.2), 1.5);
    zoomRef.current = newScale;

    worldDivRef.current!.style.transform = 
      `scale(${zoomRef.current}) translate(${offsetRef.current.x}px, ${offsetRef.current.y}px)`;
    worldDivRef.current!.style.transformOrigin = "center center";

    clearTimeout(wheelTimeout)
    wheelTimeout = setTimeout(() => {
      if(chat.$loki) {
        console.log(zoomRef.current)
        window.chat.updateChatZoomScale(chat.$loki, zoomRef.current)
      }
    }, 200)
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

  // TODO แก้ rerender 4 รอบ หาให้เจอ หลัง feature หลักครบ!!!!!!!!
  // console.log("first page rerender");
  console.log(chat);

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
            handleMouseDown={handleMouseDown}
            setObjectRefs={setObjectRefs}
          />
        ))}
      </World>
    </div>
  )
}

export default InfiniteCanvas;