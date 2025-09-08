import { useLocation, useNavigate, useParams } from "react-router-dom"
import InfiniteCanvas from "../components/InfiniteCanvas"
import InputPrompt from "../components/InputPrompt";
import { useChatCanvas } from "../store/chatstore";
import { useQuery } from "@tanstack/react-query";

export const Home = () => {
  const { id: chatId } = useParams();
  const url = useLocation();
  const navigate = useNavigate();
  
  const { setChat } = useChatCanvas();

  const { isPending } = useQuery<Chat>({
    queryKey: ['chat', chatId], // ใส่ chatId เหมือน dependencies ของ useeffect
    queryFn: async () => {
      if(chatId) {
        const chat = await window.chat.getChat(chatId);
        if(chat) {
          setChat(chat)
        }
        else {
          setChat({ name: "", chat_logs: [] })
          navigate('/');
        }

        return chat
      }
      else {
        setChat({ name: "", chat_logs: [] });
        return ({ name: "", chat_logs: [] })
      }
    }
  })

  return (
    <>
      {!isPending && <InfiniteCanvas />}
      <InputPrompt />
      <div className="fixed top-10 flex w-full justify-center">http://localhost:5173{url.pathname}</div>
    </>
  )
}
