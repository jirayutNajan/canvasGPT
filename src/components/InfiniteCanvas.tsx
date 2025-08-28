import { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import GridBackGround from "./GridBackGround";
import { useChatCanvas } from "../store/chatstore";
import Chat from "./Chat";

const InfiniteCanvasKonva = ({isSideBarClosed}: {isSideBarClosed: boolean}) => {
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const { chat, setChat, addChatLog } = useChatCanvas();

  // กัน window resize แล้ว canvas size ไม่เปลี่ยน
  useEffect(() => {
    const handleResize = () => setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return (
    // Stage คือ canvas หลัก
    <div className={`${isSideBarClosed ? "pl-15": "pl-50"}`}>
      <Stage 
        width={canvasSize.width} 
        height={canvasSize.height}
        draggable
        onDragEnd={e => {
          setStagePos(e.currentTarget.position())
        }}
      >
        <Layer>
          <GridBackGround width={canvasSize.width} height={canvasSize.height} stagePos={stagePos} />
          {/* <Rect x={600} y={600} width={100} height={100} fill="red" draggable/> */}
          {chat.chat_logs?.map((log) => (
            <Chat chatLog={log} key={log._id || log.input}/>
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default InfiniteCanvasKonva;