import { useCallback, useRef, useEffect } from "react";
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

import Post from "./Post.tsx";
import "./App.css";

import "./global.css";

const nodeTypes = {
  post: Post,
};

const edgeTypes = {
  floating: FloatingEdge,
};

let id = 1;
const getId = () => `${id++}`;

const Main = () => {
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    type Position = { x: number; y: number };

    let closed: Position[] = [];

    const postRect = {
      x: 500,
      y: 400,
    };

    const gridSize = {
      x: 8,
      y: 11,
    };

    const getPos = () => {
      let position = { x: 0, y: 0 };

      while (closed.find(({ x, y }) => x == position.x && y == position.y)) {
        position = {
          x: Math.floor(Math.random() * gridSize.x),
          y: Math.floor(Math.random() * gridSize.y),
        };
      }

      closed.push(position);

      return {
        x:
          (position.x - gridSize.x / 2) * postRect.x +
          ((Math.random() - 0.5) * postRect.x) / 4 +
          postRect.x * 2,
        y:
          (position.y - gridSize.y / 2) * postRect.y +
          ((Math.random() - 0.5) * postRect.y) / 4 +
          (position.x % 2 == 0 ? postRect.y / 2 : 0) +
          postRect.y,
      };
    };

    const GetPosts = async (count: number) => {
      let idMap: { [id: string]: string } = {};

      const nodes = await fetch(
        "http://127.0.0.1:8090/api/collections/posts/records?sort=@random&perPage=" +
          count,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((json) =>
          json.items.map(
            ({
              id,
              body,
              user,
            }: {
              id: number;
              body: string;
              user: string;
            }) => {
              let nodeId = getId();

              idMap[id] = nodeId;

              return {
                id: nodeId,
                type: "post",
                data: { postStyle: "text", text: body, user: user },
                position: getPos(),
                user: user,
              };
            }
          )
        );

      setNodes(nodes);

      const edges = await fetch(
        "http://127.0.0.1:8090/api/collections/edges/records",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((json) =>
          json.items.map(
            ({ parent, child }: { parent: string; child: string }) => {
              return {
                id: getId(),
                type: "floating",
                source: idMap[parent],
                target: idMap[child],
              } as any;
            }
          )
        );

      setEdges(edges);
    };

    GetPosts(gridSize.x * gridSize.y);
  }, []);

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
        const newNode: any = {
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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#c4e5fa",
      }}
    >
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
        minZoom={0.001}
        maxZoom={1.4}
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
