import { IoMdAdd } from "react-icons/io"
import { useEffect, useState } from "react"

const Sidebar = ({
  isSideBarClosed, 
  setSideBarClosed, 
}: {
  isSideBarClosed: boolean, 
  setSideBarClosed: () => void,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const docs = await window.chatsDB.find({}, { chat_logs: 0 })
        if(docs.length !== 0) {
          setChats(docs);
        }
        // TODO add dummy doc
      } catch (error) {
        console.log(error)
      }
    }

    fetchChat()
  }, [])

  return (
    <div className={`fixed ${isSideBarClosed ? "w-15": "w-50"} h-screen bg-[#2a2a2a] flex flex-col py-4 px-3`}>
      <h1 className="text-xl">CanvasGPT</h1>
      <div className="flex items-center mt-4 gap-2 hover:bg-[#0000003c] p-2 rounded-xl cursor-pointer">
        <IoMdAdd size={20}/>
        <h1>New Canvas</h1>
      </div>
      <hr className="text-[#7b7b7b] my-1" />
      <h1 className="py-1 text-[#b8b4b4]">Chats</h1>
      <div>
        {chats?.map((chat) => (
          <div className="hover:bg-[#0000003c] py-1 px-2 cursor-pointer rounded-md text-sm" key={chat._id}>
            <h1 className="truncate">{chat.name}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar