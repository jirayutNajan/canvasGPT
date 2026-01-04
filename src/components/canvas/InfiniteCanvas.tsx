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
  addEdge
} 
from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Chat } from "../../interface/ChatInterface"
import { useState, useCallback, useMemo } from 'react'

// Define nodeTypes outside the component to prevent recreation on each render
// const nodeTypes = { chatBox: ChatBox }

const InfiniteCanvas = ({ chat }: { chat: Chat }) => {
  const [nodes, setNodes] = useState<Node[]>(useMemo(() => {
    return chat.chat_logs.map((log) => {
      // console.log('node')
      return {
        id: log._id.toString(),
        position: log.position,
        data: {
          label: log.input
        }
      }
    })
    }, [chat.chat_logs])
  )

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

  return (
    <div className="ml-50 bg-white h-screen w-screen text-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}

export default InfiniteCanvas