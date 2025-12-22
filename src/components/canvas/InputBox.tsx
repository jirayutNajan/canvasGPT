import { memo, useEffect, useRef, useState } from "react";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useChatStore } from "../../store/chatstore";

const InputBox = memo(({ setInputRef, scale }: { setInputRef: (input: HTMLDivElement) => void, scale: number }) => {
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

  const handleSubmit = () => {

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
        scale: scale
      }}
    >
      <form onSubmit={handleSubmit} className="flex" >
        <input 
          ref={textInputRef}
          type="text" 
          placeholder="Ask anything" 
          className="flex-1 outline-0 "
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">
          <FaCircleArrowUp className="size-8"/>
        </button>
      </form>
    </div>
  )
})

export default InputBox;