import { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

import Post from "./Post.tsx";
import "./App.css";

const nodeTypes = {
  post: Post,
};

const initialNodes = [
  {
    id: "1",
    type: "post",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "2",
    type: "post",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
  {
    id: "3",
    type: "post",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "4",
    type: "post",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
  {
    id: "5",
    type: "post",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "6",
    type: "post",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
  );
};

function Main() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default Main;
