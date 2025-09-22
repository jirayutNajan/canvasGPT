import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { FaCircleArrowUp } from "react-icons/fa6"
import { useChatCanvas } from "../store/chatstore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const InputPrompt = () => {
  const [text, setText] = useState("");
  
  const { chat, addChatLog, setChat } = useChatCanvas();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: addChat } = useMutation({
    mutationFn: async (input: string) => {
      if(chat.chat_logs?.length === 0) setChat({name: input});

      // TODO implement ai กับ electron ใน main.js
      const dummyChatLog: ChatLog = {
        _id: chat?.chat_logs?.length ? chat?.chat_logs?.length + 1 : 1,
        input, 
        response: "ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅ ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅ ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅ ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅ ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅ ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅",
        createdAt: Date.now().toString(), 
        // position: chat?.chat_logs?.length === 0 ? { x: window.innerWidth/2, y: window.innerHeight/2 } : { x: 0, y: 0 }, 
        position: { x: 0, y: 0},
        refers: 1
      }

      addChatLog(dummyChatLog)
      
      // TODO ย้่ายโค้ดนี้ไปที่ store
      // new chat
      if(chat.chat_logs?.length === 0) {
        let newChat: Chat = {
          name: input,
          chat_logs: [dummyChatLog],
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
    addChat(text)
    setText("");
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      <div className="flex h-full flex-col-reverse">
        <div className="flex justify-center mb-5">
          <div className="bg-[#303030] p-3 rounded-2xl w-md flex">
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
  )
}

export default InputPrompt