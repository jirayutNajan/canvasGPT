import { useLocation } from "react-router-dom";
import { IoMdAdd } from "react-icons/io"
import { useSideBarstore } from "../../store/sidebarstore";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
  // TODO toggle sidebar
  const { isOpen: isSideBarOpen } = useSideBarstore();
  const url = useLocation();

  const { data: chats } = useQuery<{ $loki: number, name: string }[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const docs = await window.chat.getChats();
      if(docs.length !== 0) {
        return docs;
      }
      else return [];
    }
  })

  return (
    <div className={`fixed ${!isSideBarOpen ? "w-15": "w-50"} h-screen bg-[#2a2a2a] flex flex-col py-4 px-3 z-10`}>
      <div className="fixed top-10 flex w-full justify-center text-black">http://localhost:5173{url.pathname}</div>
      <Link to={"/"}>
        <h1 className="text-xl">CanvasGPT</h1>
      </Link>
      <Link to={"/"}>
        <div className="flex items-center mt-4 gap-2 hover:bg-[#0000003c] p-2 rounded-xl cursor-pointer">
          <IoMdAdd size={20}/>
            <h1>New Canvas</h1>
        </div>
      </Link>
      <hr className="text-[#7b7b7b] my-1" />
      <h1 className="py-1 text-[#b8b4b4]">Chats</h1>
      <div>
        {chats?.map((chat) => (
          <Link key={chat.$loki} to={`/${chat.$loki}`}>
            <div className="hover:bg-[#0000003c] py-1 px-2 cursor-pointer rounded-md text-sm">
              <h1 className="truncate">{chat.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar