import { useLocation, useNavigate, useParams } from "react-router-dom"
import InfiniteCanvas from "../components/InfiniteCanvas"
import InputPrompt from "../components/InputPrompt";
import { useChatCanvas } from "../store/chatstore";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const Home = () => {
  const { id: chatId } = useParams();
  const url = useLocation();
  const navigate = useNavigate();

  const { chat, setChat, addChatLog } = useChatCanvas();

  const [isFinishLoading, setFinishLoading] = useState(false);

  useEffect(() => {
    async function getChat() {
      setFinishLoading(false);
      if(chatId) {
        const chat = await window.chat.getChat(chatId);
        if(chat) {
          setChat(chat)
        }
        else {
          setChat({ name: "", chat_logs: [] })
          navigate('/');
        }
      }
      else {
        setChat({ name: "", chat_logs: [] })
      }
      setFinishLoading(true);
    }

    getChat()
  }, [chatId])

  

  const AddChat = async (input: string) => {
    if(chat.chat_logs?.length === 0) setChat({name: input});

    const dummyChatLog: ChatLog = {
      _id: uuidv4(),
      input, 
      response: "ChatGPT ทำงานโดยใช้ โมเดลภาษา (Large Language Model) ที่ฝึกจากข้อความจำนวนมหาศาล เพื่อเรียนรู้รูปแบบภาษา ความสัมพันธ์ของคำ และบริบท เวลาเราพิมพ์ข้อความเข้าไป โมเดลจะคำนวณหาคำถัดไปที่น่าจะใช่ที่สุดต่อเนื่องไปเรื่อย ๆ จนกลายเป็นประโยคหรือคำตอบที่เห็นครับ ✅",
      createdAt: Date.now().toString(), 
      position: chat.chat_logs?.length === 0 ? { x: window.innerWidth/2, y: window.innerHeight/2 } : { x: 0, y: 0 } 
    }

    addChatLog(dummyChatLog)

    if(chat.chat_logs?.length === 0) {
      let newChat: Chat = {
        name: input,
        chat_logs: [dummyChatLog],
      }
      await window.chat.addChat(newChat);
    }
    else {
      let updatedChat: Chat = {
        ...chat,
        chat_logs: [
          ...(chat.chat_logs || []),
          dummyChatLog
        ]
      }
      await window.chat.updateChat(updatedChat)
    }
  }

  return (
    <>
      {isFinishLoading && <InfiniteCanvas />}
      <InputPrompt addChat={AddChat} />
      <div className="fixed top-3 flex w-full justify-center">http://localhost:5173{url.pathname}</div>
    </>
  )
}
