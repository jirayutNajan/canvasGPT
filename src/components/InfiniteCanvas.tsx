import { useEffect, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import GridBackGround from "./GirdBackGround";
import { useChatCanvas } from "../store/chatcanvas";
import Chat from "./Chat";

const InfiniteCanvasKonva: React.FC = () => {
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
    <div>
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