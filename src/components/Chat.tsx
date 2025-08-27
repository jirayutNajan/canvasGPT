import { useEffect, useRef, useState } from "react";
import { Group, Rect, Text } from "react-konva";
import Konva from "konva";

const WIDTH = 700;

const Chat = ({ chatLog }: { chatLog: ChatLog }) => {
  return (
    <>
      <Group
        x={chatLog.position.x - WIDTH/2}
        y={chatLog.position.y - WIDTH/2}
        width={WIDTH}
        draggable
      >
        <Input input={chatLog.input} response={chatLog.response || ""} />
      </Group>
    </>
  )
}

export default Chat;

const Input = ({ input, response }: { input: string, response: string }) => {
  const inputRef = useRef<Konva.Text>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [inputHeight, setInputHeight] = useState(0);

  const responseRef = useRef<Konva.Text>(null);
  const [responseWidth, setResponseWidth] = useState(0);
  const [responseHeight, setResponseHeight] = useState(0);

  const padding = 10;
  const gap = 30;

  useEffect(() => {
    if(inputRef.current) {
      setInputWidth(Math.min(inputRef.current.width(), WIDTH/2));
      setInputHeight(inputRef.current.height());
    }
    if(responseRef.current) {
      setResponseWidth(Math.min(responseRef.current.width(), WIDTH));
      setResponseHeight(responseRef.current.height());
    }
  }, [inputWidth, responseWidth])

  return (
    <>
      <Rect
        x={WIDTH - inputWidth - padding}
        y={-padding}
        width={inputWidth + padding*2}
        height={inputHeight + padding*2}
        fill="#303030"
        cornerRadius={10}
      />
      <Text
        x={WIDTH - inputWidth}
        text={input}
        fill="white"
        align={inputWidth >= WIDTH/2 ? "left": "right"}
        fontSize={18}
        ref={inputRef}
        width={inputWidth >= WIDTH/2 ? WIDTH/2: undefined}
      />

      <Rect
        x={WIDTH - responseWidth - padding}
        y={-padding + inputHeight + gap}
        width={responseWidth + padding*2}
        height={responseHeight + padding*2}
        fill="#303030"
        cornerRadius={10}
      />
      <Text
        x={WIDTH - responseWidth}
        y={inputHeight + gap}
        text={response}
        fill="white"
        align={responseWidth >= WIDTH ? "left": "right"}
        fontSize={18}
        ref={responseRef}
        width={responseWidth >= WIDTH ? WIDTH: undefined}
      />
    </>
  )
}