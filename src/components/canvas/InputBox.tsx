import { memo, useEffect, useRef, useState } from "react";
import { FaCircleArrowUp, FaXmark } from "react-icons/fa6";
// import { useChatStore } from "../../store/chatstore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Chat, ChatLog } from "../../interface/ChatInterface";
import { useReplyChatStore } from "../../store/replychatstore";

const InputBox = memo((
  { 
    setInputRef, 
    scale, 
    setIsAddInput,
    chat 
  }: 
  { 
    setInputRef: (input: HTMLDivElement) => void, 
    scale: number, 
    setIsAddInput: (addInput: boolean) => void,
    chat: Chat
  }) => {
  const queryClient = useQueryClient();
  const { replyChatId, setReplyChatId, setReplyChatText } = useReplyChatStore();
  const navigate = useNavigate();

  const inputBoxRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  // const { setIsAddInput, setInput } = useChatStore()
  const [ edit, setEdit ] = useState(false)
  const [ text, setText ] = useState("")

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if(!edit) {
        const scale = Number(inputBoxRef.current?.style.scale) || 1
        inputBoxRef.current!.style.transform = `translate(${e.clientX /scale}px, ${e.clientY /scale}px)`
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [edit])
  
  useEffect(() => {
    if(inputBoxRef.current) {
      setInputRef(inputBoxRef.current)
    }
  }, [setInputRef])

  const { mutateAsync: addChat } = useMutation({
    mutationFn: async (input: string) => {
      const previousChatLog: ChatLog[] = []

      if(replyChatId) {
        let currentChatId: number | null = replyChatId;
        while(currentChatId != null) {
          // unshift คือเพ่ิมข้างหน้า
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

      let newPosition = { x: 0, y: 0 }
      if(chat.chat_logs.length != 0) {
        if(replyChatId != null) newPosition = { x: chat.chat_logs[replyChatId].position.x, y: chat.chat_logs[replyChatId].position.y + 200 }
      }

      const newChatLog: ChatLog = {
        _id: chat?.chat_logs?.length ? chat?.chat_logs?.length : 0,
        input, 
        response,
        createdAt: Date.now().toString(),
        position: newPosition,
        parent: replyChatId != null ? [replyChatId] : [],
        child: []
      }

      queryClient.setQueryData<Chat>(['chat', chat.$loki], (oldData: Chat | undefined) => {
        if(!oldData) return { name: "", chat_logs: [], newChatBoxPosition: { x: 0, y: 0 }, offset: { x: 0, y: 0 }}

        return {
          ...oldData,
          chat_logs: [...chat.chat_logs, newChatLog],
          newChatBoxPosition: newPosition
        }
      })
      
      // new chat
      if(chat.chat_logs?.length === 0) {
        let newChat: Chat = {
          name: input,
          chat_logs: [newChatLog],
          zoomScale: 1,
          newChatBoxPosition: { x: 0, y: 0 },
          offset: { x: 0, y: 0 }
        }
        newChat = await window.chat.addChat(newChat);
        // add chat ไปที่ sidebar
        queryClient.setQueryData(['chats'], (oldData: { $loki: number, name: string }[]) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(text)
    // await addChat(text) 
    console.log(inputBoxRef.current?.style.position)
    setText("");
    setReplyChatText("");
    setReplyChatId(null);
    setReplyChatText("");
  }

  const handleClick = () => {
    setEdit(true)
    textInputRef.current?.focus()
  }

  return (
    <div 
    ref={inputBoxRef}
    className={ `fixed -top-[25px] -left-[200px] w-[400px] bg-[#4c4c4c] border border-[#6a6a6a] p-2 rounded-xl
      ${!edit && "opacity-40"} scale-[]` }
      onClick={() => { 
        if(!edit) { 
          handleClick()
          } }}
      style={{
        transformOrigin: '0 0',
        scale: scale
      }}
    >
      <div className="absolute top-0 right-0 -translate-y-[50%] translate-x-[50%] rounded-full bg-red-400 p-[2px]
      cursor-pointer" onClick={() => setIsAddInput(false)}>
        <FaXmark />
      </div>
      <form onSubmit={handleSubmit} className="flex" >
        <input 
          ref={textInputRef}
          type="text" 
          placeholder="Ask anything" 
          onChange={(e) => setText(e.target.value)}
          className="flex-1 outline-0 "
          value={text}
        />
        <button type="submit">
          <FaCircleArrowUp className="size-8"/>
        </button>
      </form>
    </div>
  )
})

export default InputBox;