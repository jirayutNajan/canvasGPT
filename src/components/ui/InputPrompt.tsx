import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import { FaCircleArrowUp } from "react-icons/fa6"
import { useChatCanvas } from "../../store/chatstore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { Chat, ChatLog } from "../../interface/ChatInterface";
import { useReplyChatStore } from "../../store/replychatstore";

// ทำ chat reply ต่อ

const InputPrompt = ({ chatId }: { chatId?: string }) => {
  const [text, setText] = useState("");
  
  const { chat, addChatLog, setChat, setLoadingInput } = useChatCanvas();
  const { replyChatId, replyChatText, setReplyChatId, setReplyChatText } = useReplyChatStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: addChat, isPending } = useMutation({
    mutationFn: async (input: string) => {
      if(chat.chat_logs?.length === 0) setChat({name: input, zoomScale: 1, chat_logs: [], newChatBoxPosition: { x: 0, y: 0 }});

      const previousChatLog: ChatLog[] = []

      if(replyChatId) {
        let currentChatId: number | null = replyChatId;
        while(currentChatId != null) {
          previousChatLog.unshift(chat.chat_logs[currentChatId]);
          if(chat.chat_logs[currentChatId].parent[0] != null) {
            currentChatId = chat.chat_logs[currentChatId].parent[0]
          }
          else {
            currentChatId = null
          }
        }
      }

      const response = await window.chatGPT.getChatResponse(previousChatLog, input)

      
      let newPosition = chat.newChatBoxPosition ? chat.newChatBoxPosition : { x: 0, y: 0 }
      console.log(newPosition)
      if(chat.chat_logs.length != 0) {
        if(replyChatId) {
          let yPos = chat.chat_logs[replyChatId].position.y
          chat.chat_logs[replyChatId].child.forEach(() => {
            yPos += chat.chat_logs[replyChatId].position.y + 500
          })
          newPosition = { x: chat.chat_logs[replyChatId].position.x, y: yPos }
        }
        else {
          newPosition.x += 750
        }
      }

      console.log(newPosition)
      
      // TODO implement ai กับ electron ใน main.js
      const newChatLog: ChatLog = {
        _id: chat?.chat_logs?.length ? chat?.chat_logs?.length : 0,
        input, 
        response,
        createdAt: Date.now().toString(), 
        // position: { x: 0, y: 0},
        position: newPosition,
        parent: replyChatId != null ? [replyChatId] : [],
        child: []
      }

      addChatLog(newChatLog)
      
      // new chat
      if(chat.chat_logs?.length === 0) {
        let newChat: Chat = {
          name: input,
          chat_logs: [newChatLog],
          zoomScale: 1,
          newChatBoxPosition: { x: 0, y: 0 }
        }
        newChat = await window.chat.addChat(newChat);
        queryClient.setQueryData(['chats'], (oldData: Chat[]) => {
          return [
            newChat,
            ...oldData
          ]
        })
        navigate(`${queryClient.getQueryData<Chat[]>(['chats'])?.length}`)
      }
      else {
        if(chat.$loki) window.chat.addChatLog(chat.$loki, newChatLog)
      }
    }
  })

  const handleClick = async () => {
    if(!text.trim() || isPending) return;
    await addChat(text)
    setText("");
    setReplyChatId(null);
    setReplyChatText("");
  }

  useEffect(() => {
    if(isPending) {
      setLoadingInput(text)
    }
    else {
      setLoadingInput("")
    }
  }, [isPending])

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10  pointer-events-none">
      <div className="flex h-full justify-center">
        <div className="flex flex-col w-md mb-5">
          {replyChatId != null && (
            <>
              <div className="bg-[#303030] w-full truncate rounded-t-2xl border-2 border-b-0 border-white text-sm
              text-[#696969] p-1">
                {replyChatText}
              </div>
              <hr className="text-[#b2b2b2]" />
            </>
          )}
          <div className="flex w-full pointer-events-auto">
            <div className={`bg-[#303030] p-3 flex w-full ${replyChatId != null ? "border-2 border-t-0 border-white" : ""}
            ${replyChatId != null ? "rounded-b-2xl pt-0.5": "rounded-2xl"}`}>
              <input 
                type="text"
                className="outline-none ring-0 p-2 rounded-xl w-full"
                disabled={isPending}
                placeholder="Ask anything"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter") {
                    handleClick();
                  }
                }} 
              />
              <button disabled={isPending} onClick={handleClick}>
                <FaCircleArrowUp className="size-8"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputPrompt