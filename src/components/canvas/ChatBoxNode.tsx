import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import { memo, type ComponentPropsWithoutRef } from "react"
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import './Markdown.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export type ChatBoxNode = Node<
  {
    input: string,
    response: string,
  }
>

const remarkPlugins = [remarkMath, remarkGfm]
const rehypePlugins = [rehypeKatex]

const MarkdownRenderer = memo(({ content }: { content: string }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          code({ 
            inline, 
            className, 
            children, 
            ...props 
          }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
              const match = /language-(\w+)/.exec(className || '');

              return !inline && match ? (
                <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

export default function ChatBoxNode({ data }: NodeProps<ChatBoxNode>) {
  return (
    <div className="relative max-w-4xl min-w-sm bg-black p-1 rounded-xl">
      <div className="absolute draghandle inset-0 z-0" />

      <div className="relative z-10 bg-white cursor-auto rounded-lg p-5">
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        <div className="flex justify-end">
          <div className="rounded-xl bg-gray-200 min-w-20 text-end px-3">
            <MarkdownRenderer content={data.input} />
          </div>
        </div>
        <MarkdownRenderer content={data.response} />
      </div>
    </div>
  )
}