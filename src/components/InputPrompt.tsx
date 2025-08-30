import { useState } from "react"
import { FaCircleArrowUp } from "react-icons/fa6"

const InputPrompt = ({ addChat }: { addChat: (input: string) => void }) => {
  const [text, setText] = useState("");

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