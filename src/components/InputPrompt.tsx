import { useState } from "react"
import { useChatCanvas } from "../store/chatstore";
import { FaCircleArrowUp } from "react-icons/fa6"

const InputPrompt = () => {
  const [text, setText] = useState("");

  // chat แค่ของ canvas ปัจจุบัน
  const { chat, setChat, addChatLog } = useChatCanvas();

  const handleClick = async () => {
    // await window.chatsDB.insert({text, createdAt: Date.now().toString(), position: { x: 0, y: 0 } })
    if(!text.trim()) return;

    if(chat.chat_logs?.length === 0) setChat({name: text});
    const dummyResponse = {
      input: text, 
      response: "ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅",
      createdAt: Date.now().toString(), 
      position: chat.chat_logs?.length === 0 ? { x: window.innerWidth/2, y: window.innerHeight/2 } : { x: 0, y: 0 } 
    }

    addChatLog(dummyResponse)

    // save to db
    window.chatsDB.insert({
      _id: "xxxasdf",
      name: text,
      chat_logs: [dummyResponse, dummyResponse]
    })
    
    setText("");
  }

  console.log(chat)

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