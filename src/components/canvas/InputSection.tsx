import { useState, type FormEvent } from "react";
import { FaArrowUp } from "react-icons/fa6";

const InputSection = ({ addChatInput } : { addChatInput: (input: string) => void }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(input.trim() == "") return;

    addChatInput(input)
    setInput("")
  }

  return (
    <div className="absolute bottom-10 flex w-full justify-center">
      <form 
        className="bg-gray-200 p-2 rounded-xl w-md flex justify-between px-3 gap-5"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input 
          className="flex-1 focus:ring-0 focus:outline-none focus:border-black/20
          rounded-lg"
          placeholder="Ask something"
          value={input}
          onChange={(e) => setInput((e.target.value))}
        />
        <button type="submit" className="rounded-full bg-gray-100 size-10 flex justify-center items-center">
          <FaArrowUp size={20} />
        </button>
      </form>
    </div>
  )
}

export default InputSection;
