import { 
  Background, 
  Controls, 
  ReactFlow, 
  type Node, 
  type Edge,
  type OnNodesChange,
  applyNodeChanges,
  type OnEdgesChange,
  applyEdgeChanges,
  type OnConnect,
  addEdge,
  type OnNodeDrag,
  type Viewport,
  useReactFlow
} 
from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Chat } from "../../interface/ChatInterface"
import { useState, useCallback, useMemo } from 'react'
import ChatBoxNode from './ChatBoxNode'

// Define nodeTypes outside the component to prevent recreation on each render
const nodeTypes = { chatBox: ChatBoxNode }

const InfiniteCanvas = ({ chat }: { chat: Chat }) => {
  const reactFlow = useReactFlow();
  const [viewPort, setViewPort] = useState({ x: chat.offset.x || 0, y: chat.offset.y || 0, zoom: chat.zoomScale || 1 });
  
  const initialNodes = useMemo(() => {
    return chat.chat_logs.map((log) => {
      // console.log('node')
      return {
        id: log._id.toString(),
        position: log.position,
        data: {
          input: log.input,
          response: log._id == 0 ? `# ⚛️ React JS - Getting Started

## What is React?

**React** is a JavaScript library for building user interfaces. It was developed by **Facebook** and is now maintained by Meta.

### Key Features

- 🔄 **Virtual DOM** - Efficient updates
- 🧩 **Component-Based** - Reusable UI pieces  
- 📱 **Learn Once, Write Anywhere**

---

## Installation

### Using Vite (Recommended)

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

### Using Create React App

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

---

## Your First Component

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return <Welcome name="React" />;
}
\`\`\`

---

## useState Hook

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

---

## useEffect Hook

\`\`\`jsx
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []); // Empty deps = run once
  
  return <div>{data}</div>;
}
\`\`\`

---

## Props vs State

| **Props** | **State** |
|-----------|-----------|
| Passed from parent | Local to component |
| Read-only | Mutable via setter |
| \`props.name\` | \`useState()\` |

---

## Conditional Rendering

\`\`\`jsx
function Greeting({ isLoggedIn }) {
  return isLoggedIn 
    ? <h1>Welcome back!</h1> 
    : <h1>Please sign in</h1>;
}
\`\`\`

---

## Lists & Keys

\`\`\`jsx
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
\`\`\`

---

## 📚 Resources

- [React Docs](https://react.dev)
- [React Tutorial](https://react.dev/learn)
` : log.response
        },
        type: 'chatBox',
        dragHandle: '.draghandle'
      }
    })
  }, [chat.chat_logs])

  const [nodes, setNodes] = useState<Node[]>(initialNodes)

  const [edges, setEdges] = useState<Edge[]>(() => {
    // console.log('edge')
    const newEdges: Edge[] = []

    chat.chat_logs.forEach((log) => {
      log.child.forEach((child) => {
        newEdges.push({
          id: `${log._id}-${child}`,
          source: log._id.toString(),
          target: child.toString()
        })
      })
    })

    return newEdges
  })

    const onNodesChange: OnNodesChange = useCallback( // get call when trigger trigger change
    (changes) => setNodes((nodesSnapShot) => {
      return applyNodeChanges(changes, nodesSnapShot) // return array of node
    }), []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => {
      return applyEdgeChanges(changes, edgesSnapshot)
    }), []
  )

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => { 
      return addEdge(params, edgesSnapshot) 
    }), []
  )

  const onNodeDragStop: OnNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
    if(chat.$loki) window.chat.updateChatLogXY(chat.$loki, Number(node.id), { x: node.position.x, y: node.position.y })
    // console.log(node.position)
  }, [chat.$loki])

  const onViewportChange = useCallback((viewPort: Viewport) => {
    setViewPort({ x: viewPort.x, y: viewPort.y, zoom: viewPort.zoom })
    if(chat.$loki) {
      window.chat.updateChatOffset(chat.$loki, { x: viewPort.x, y: viewPort.y })
      window.chat.updateChatZoomScale(chat.$loki, viewPort.zoom)
    }
    // console.log(viewPort)
  }, [chat.$loki])

  const addNode = useCallback((node: Node) => {
    reactFlow.addNodes(node)
    if(chat.$loki) window.chat.addChatLog(chat.$loki, { 
      _id: node.id,
      input: node.data.input,
      response: node.data.response,
      position: node.position,
      parent: [],
      child: [],
    })
  }, [reactFlow, chat.$loki])

  return (
    <div className="relative ml-50 bg-white h-screen text-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        viewport={viewPort}
        onViewportChange={onViewportChange}
      >
        <Controls />
        <Background />
      </ReactFlow>
    
      <button 
        className='absolute right-0 bottom-0 mr-20 mb-20 bg-gray-500 font-bold cursor-pointer'
        onClick={() => {addNode({
          id: reactFlow.getNodes().length.toString(),
          position: { x: viewPort.x/2, y: viewPort.y/2 },
          data: {
            input: "input",
            response: "response"
          },
          type: 'chatBox',
          dragHandle: '.draghandle'
        })}}>
        Add new
      </button>
    </div>
  )
}

export default InfiniteCanvas