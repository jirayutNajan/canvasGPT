import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { FaCircleArrowUp } from "react-icons/fa6"
import { useChatCanvas } from "../../store/chatstore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { Chat, ChatLog } from "../../interface/ChatInterface";
import { useReplyChatStore } from "../../store/replychatstore";

// ทำ chat reply ต่อ

const InputPrompt = () => {
  const [text, setText] = useState("");
  
  const { chat, addChatLog, setChat } = useChatCanvas();
  const { replyChatId, replyChatText, setReplyChatId, setReplyChatText } = useReplyChatStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: addChat } = useMutation({
    mutationFn: async (input: string) => {
      if(chat.chat_logs?.length === 0) setChat({name: input, zoomScale: 1});

      // TODO implement ai กับ electron ใน main.js
      const dummyChatLog: ChatLog = {
        _id: chat?.chat_logs?.length ? chat?.chat_logs?.length + 1 : 1,
        input, 
        response: "ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ",
        createdAt: Date.now().toString(), 
        // position: chat?.chat_logs?.length === 0 ? { x: window.innerWidth/2, y: window.innerHeight/2 } : { x: 0, y: 0 }, 
        position: { x: 0, y: 0},
        refers: replyChatId || undefined
      }

      addChatLog(dummyChatLog)
      
      // TODO ย้่ายโค้ดนี้ไปที่ store
      // new chat
      if(chat.chat_logs?.length === 0) {
        let newChat: Chat = {
          name: input,
          chat_logs: [dummyChatLog],
          zoomScale: 1,
        }
        newChat = await window.chat.addChat(newChat);
        setChat(newChat);
        queryClient.setQueryData(['chats'], (oldData: Chat[]) => {
          return [
            newChat,
            ...oldData
          ]
        })
        navigate(`${queryClient.getQueryData<Chat[]>(['chats'])?.length}`)
      }
      else {
        let updatedChat: Chat = {
          ...chat,
          chat_logs: [
            ...(chat.chat_logs || []),
            dummyChatLog
          ],
        }
        setChat(updatedChat);
        await window.chat.updateChat(updatedChat);
      }
    }
  })

  const handleClick = async () => {
    if(!text.trim()) return;
    await addChat(text)
    setText("");
    setReplyChatId(null);
    setReplyChatText("");
  }

  // TODO แยก input เป็นอีก form กัน rerender เยอะ

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 ">
      <div className="flex h-full justify-center">
        <div className="flex flex-col w-md mb-5">
          {replyChatId && (
            <>
              <div className="bg-[#303030] w-full truncate rounded-t-2xl border-2 border-b-0 border-white text-sm
              text-[#696969] p-1">
                {replyChatText}
              </div>
              <hr className="text-[#b2b2b2]" />
            </>
          )}
          <div className="flex w-full">
            <div className={`bg-[#303030] p-3 flex w-full ${replyChatId ? "border-2 border-t-0 border-white" : ""}
            ${replyChatId ? "rounded-b-2xl pt-0.5": "rounded-2xl"}`}>
              <input 
                type="text"
                className="outline-none ring-0 p-2 rounded-xl w-full"
                placeholder="Ask anything"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter") {
                    handleClick();
                  }
                }} 
              />
              <FaCircleArrowUp className="h-full size-8" onClick={handleClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputPrompt