import { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  EdgeTypes,
  ConnectionLineComponent,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import FloatingEdge from "./FloatingEdge.tsx";
import FloatingConnectionLine from "./FloatingConnectionLine.tsx";
import { createNodesAndEdges } from "./utils.ts";

import Post from "./Post.tsx";
import "./App.css";

const nodeTypes = {
  post: Post,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges();

let id = 20;
const getId = () => `${id++}`;

const Main = () => {
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "floating",
            markerEnd: { type: MarkerType.Arrow },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: any }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const newNode = {
          id,
          type: "post",
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            type: "floating",
            source: connectingNodeId.current,
            target: id,
          } as any)
        );
      }
    },
    [screenToFlowPosition]
  );

  return (
    <div className="main">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes as EdgeTypes}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        connectionLineComponent={
          FloatingConnectionLine as ConnectionLineComponent
        }
      />
    </div>
  );
};

const App = () => {
  return (
    <ReactFlowProvider>
      <Main />
    </ReactFlowProvider>
  );
};

export default App;
