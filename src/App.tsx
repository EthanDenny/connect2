import React, { useMemo, useCallback } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
} from "d3-force";
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useStore,
} from "reactflow";

import { collide } from "./collide.js";

import "reactflow/dist/style.css";

import TextUpdaterNode from "./TextUpdaterNode.js";

const initialNodes = [
  {
    id: "1",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "2",
    type: "textUpdater",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
  {
    id: "3",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "4",
    type: "textUpdater",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
  {
    id: "5",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "6",
    type: "textUpdater",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const simulation = forceSimulation()
  .force("charge", forceManyBody().strength(-1000))
  .force("x", forceX().x(0).strength(0.05))
  .force("y", forceY().y(0).strength(0.05))
  .force("collide", collide())
  .alphaTarget(0.05)
  .stop();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const initialised = useStore((store) =>
    [...store.nodeInternals.values()].every((node) => node.width && node.height)
  );

  return useMemo(() => {
    let nodes = getNodes().map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }));
    let edges = getEdges().map((edge) => edge);

    // If React Flow hasn't initialised our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialised || nodes.length === 0) return;

    simulation.nodes(nodes).force(
      "link",
      forceLink(edges)
        .id((d) => d.id)
        .strength(0.05)
        .distance(100)
    );

    // The tick function is called every animation frame while the simulation is
    // running and progresses the simulation one step forward each time.
    const tick = () => {
      simulation.tick();
      setNodes(
        nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } }))
      );

      window.requestAnimationFrame(() => {
        // If the simulation hasn't be stopped, schedule another tick.
        tick();
      });
    };

    window.requestAnimationFrame(tick);
  }, [initialised]);
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  useLayoutedElements();

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
        nodeTypes={{
          textUpdater: TextUpdaterNode,
        }}
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
