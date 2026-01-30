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
  useReactFlow,
}
  from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Chat } from "../../interface/ChatInterface"
import { useState, useCallback, useMemo } from 'react'
import ChatBoxNode from './ChatBoxNode'
import InputSection from './InputSection'
import { addChatlog } from '../../lib/Chat'
import { useNavigate } from 'react-router-dom'

// Define nodeTypes outside the component to prevent recreation on each render
const nodeTypes = { chatBox: ChatBoxNode }

const InfiniteCanvas = ({ chat }: { chat: Chat }) => {
  const reactFlow = useReactFlow();
  const usenavigate = useNavigate();

  const [viewPort, setViewPort] = useState({ x: chat.offset.x || 0, y: chat.offset.y || 0, zoom: chat.zoomScale || 1 });

  const initialNodes = useMemo(() => {
    return chat.chat_logs.map((log) => {
      // console.log('node')
      return {
        id: log._id.toString(),
        position: log.position,
        data: {
          input: log.input,
          response: log.input
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
    if (chat.$loki) window.chat.updateChatLogXY(chat.$loki, Number(node.id), { x: node.position.x, y: node.position.y })
    // console.log(node.position)
  }, [chat.$loki])

  const onViewportChange = useCallback((viewPort: Viewport) => {
    setViewPort({ x: viewPort.x, y: viewPort.y, zoom: viewPort.zoom })
    if (chat.$loki) {
      window.chat.updateChatOffset(chat.$loki, { x: viewPort.x, y: viewPort.y })
      window.chat.updateChatZoomScale(chat.$loki, viewPort.zoom)
    }
    // console.log(viewPort)
  }, [chat.$loki])

  // จะทำงานตอนลางวางด้วย
  // const onPaneClick = useCallback((event: React.MouseEvent) => {
  //   addNode({
  //     id: reactFlow.getNodes().length.toString(),
  //     position: reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY }),
  //     data: {
  //       input: "add from click",
  //       response: "eiei"
  //     },
  //     type: "chatBox",
  //     dragHandle: '.draghandle'
  //   })
  // }, [reactFlow])

  const handleAddChatLog = async (input: string) => {
    const chatId = await addChatlog(input, nodes.length, Number(chat?.$loki), viewPort)

    reactFlow.addNodes({
      id: nodes.length.toString(),
      position: { x: 0, y: 0},
      data: {
        input: input,
        response: "..."
      },
      type: 'chatBox',
      dragHandle: '.draghandle'
    })

    if(!chat.$loki) {
      usenavigate(`/${chatId}`)
    }
  }

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
        // onPaneClick={onPaneClick}
      >
        <Controls />
        <Background />
      </ReactFlow>

      <InputSection addChatInput={handleAddChatLog} />
    </div>
  )
}

export default InfiniteCanvas
