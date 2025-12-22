import { memo, useEffect, useRef } from "react";
import { FaCircleArrowUp } from "react-icons/fa6";

const InputBox = memo(({ setInputRef, scale }: { setInputRef: (input: HTMLDivElement) => void, scale: number }) => {
  const inputBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const scale = Number(inputBoxRef.current?.style.scale) || 1
      inputBoxRef.current!.style.transform = `translate(${e.clientX /scale}px, ${e.clientY /scale}px)`
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  console.log('re inputbox')

  useEffect(() => {
    if(inputBoxRef.current) {
      setInputRef(inputBoxRef.current)
    }
  }, [setInputRef])

  const handleSubmit = () => {

  }

  const handleClick = () => {
    console.log('click')
  }


  return (
    <div 
      ref={inputBoxRef}
      className="fixed -top-[25px] -left-[200px] w-[400px] bg-[#4c4c4c] border border-[#6a6a6a] p-2 rounded-xl pointer-events-none
      opacity-40 scale-[]"
      onClick={handleClick}
      onMouseDown={() => console.log('eiei')}
      style={{
        scale: scale
      }}
    >
      <form onSubmit={handleSubmit} className="flex" onClick={(() => console.log('eie'))}>
        <input 
          type="text" 
          placeholder="Ask anything" 
          className="flex-1"
        />
        <button type="submit">
          <FaCircleArrowUp className="size-8"/>
        </button>
      </form>
    </div>
  )
})

export default InputBox;