import { useNavigate, useParams } from "react-router-dom"
import InfiniteCanvas from "../components/canvas/InfiniteCanvas";
import { useQuery } from "@tanstack/react-query";

import type { Chat } from "../interface/ChatInterface";
import { ReactFlowProvider } from "@xyflow/react";

export const Home = () => {
  const { id: chatId } = useParams();

  const navigate = useNavigate();

  const { data: chat, isPending } = useQuery<Chat | undefined>({
    queryKey: ['chat', Number(chatId)], // ใส่ chatId เหมือน dependencies ของ useeffect
    queryFn: async () => {
      if(chatId) {
        const chat = await window.chat.getChat(chatId);
        if(!chat) navigate('/')

        return chat
      }
      else {
        return { name: "", chat_logs: [], newChatBoxPosition: { x: 0, y: 0 }, offset: { x: 0, y: 0 }}
      }
    },
  })

  if(!chat) {
    return <></>
  }

  return (
    <>
    <ReactFlowProvider key={chatId || 'new'}>
        {(!isPending) && <InfiniteCanvas chat={chat} />}
    </ReactFlowProvider>
    </>
  )
}
