import React, { memo, useState } from "react";
import SvgLine from "./SvgLine";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { forwardRef } from "react";
import type { ChatLog } from "../../interface/ChatInterface";
import { useReplyChatStore } from "../../store/replychatstore";

const ChatBox = forwardRef<
  HTMLDivElement, 
  { 
    chatLog: ChatLog;
    handleMouseDown: (e: React.MouseEvent, type: "world" | "object", id?: number) => void;
    objectsPos: React.RefObject<{ [id: number]: { x: number; y: number } }>
    objectDivRefs: React.RefObject<{ [id: string]: HTMLDivElement }>
    objectHeight: number
    setSvgRefs: (id: number, ref: SVGSVGElement) => void,
    setPathRefs: (id: number, ref: SVGPathElement) => void,
    setObjectRefs: (id: number, chatBoxRef: HTMLDivElement, svg: SVGSVGElement | null, path: SVGPathElement | null) => void
  }
  >(({ 
    chatLog, 
    handleMouseDown,
    objectsPos,
    objectDivRefs,
    objectHeight,
    setSvgRefs,
    setPathRefs,
    setObjectRefs
  }, ref ) => {
  // กันไม่ใช้ component นี้ตัวอื่นๆที่ subscribe เหมือนกัน rerender ด้วย

  const setReplyChatId = useReplyChatStore((s) => s.setReplyChatId);
  const setReplyChatText = useReplyChatStore((s) => s.setReplyChatText);

  const [isReply, setIsReply] = useState(false);


  const handleReply = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsReply(!isReply);
    if(!isReply) {
      setReplyChatId(chatLog._id);
      setReplyChatText(chatLog.response?.slice(0, 70) || "")
    }
    else {
      setReplyChatId(null);
      setReplyChatText("")
    }
  }

  const setSvgRef = (ref: SVGSVGElement) => {
    setSvgRefs(chatLog._id, ref)
  }

  const setPathRef = (ref: SVGPathElement) => {
    setPathRefs(chatLog._id, ref)
  }

  // console.log('re', chatLog._id)

  return (
    <div
      ref={ref}
      className={`w-[600px] bg-[#4c4c4c] flex flex-col gap-1 border-1 border-[#6a6a6a] hover:border-[#d3d3d3] p-2 rounded-xl
      cursor-grab select-none absolute transition-colors duration-75 group ${isReply && "border-2 border-white"}`}
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
      {chatLog?.refers && (
        <SvgLine 
          key={chatLog._id}
          objectPos={objectsPos.current[chatLog._id]}
          objectHeight={objectHeight}
          toPos={objectsPos.current[chatLog?.refers]}
          toHeight={objectDivRefs.current[chatLog.refers]?.offsetHeight}
          setSvgRef={setSvgRef}
          setPathRef={setPathRef}
        />
        )
      }
      <div className="absolute bottom-0 w-full justify-center items-center z-50 hidden group-hover:flex cursor-pointer 
      pointer-events-none">
        <div 
          className="rounded-full bg-[#515151] size-14 translate-y-[50%] flex justify-center items-center
          border-2 border-[#d3d3d3] z-50 hover:bg-[#3a3a3a] transition-colors duration-75 pointer-events-auto
          active:bg-[#292929] text-3xl"
          onMouseDown={(e) => e.stopPropagation()} // กัน onmousedown ข้างบน
          onClick={(handleReply)}
        >
          +
        </div>
      </div>
      <div 
        className="cursor-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end select-text">
          <h1 className="flex bg-[#6a6a6a] py-1 px-2 rounded-md">{chatLog.input}</h1>
        </div>
        <div className="select-text">
          <ChatReply response={chatLog.response} />
        </div>
      </div>
    </div>
  )
})

export default ChatBox

const ChatReply = memo(({ response }: { response?: string }) => {
  // console.log('re mark')
  return (
    <ReactMarkdown
      children={response}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  )
})