import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const ChatBoxSkeleton = ({ position, input }: { position: { x: number, y: number }, input: string }) => {
  return (
    <div
      className={`w-[600px] bg-[#4c4c4c] flex flex-col gap-1 border-1 border-[#6a6a6a] hover:border-[#d3d3d3] p-2 rounded-xl
      cursor-grab select-none absolute transition-colors duration-75 group`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className="absolute bottom-0 w-full justify-center items-center z-50 hidden group-hover:flex cursor-pointer 
      pointer-events-none">
        <div 
          className="rounded-full bg-[#515151] size-14 translate-y-[50%] flex justify-center items-center
          border-2 border-[#d3d3d3] z-50 hover:bg-[#3a3a3a] transition-colors duration-75 pointer-events-auto
          active:bg-[#292929] text-3xl"
        >
          +
        </div>
      </div>
      <div 
        className="cursor-auto"
      >
        <div className="flex justify-end select-text">
          <h1 className="flex bg-[#6a6a6a] py-1 px-2 rounded-md">{"input"}</h1>
        </div>
        <div className="select-text">
          <ReactMarkdown
            children={input}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBoxSkeleton