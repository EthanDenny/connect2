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
    const postRect = {
      x: 500,
      y: 400,
    };

    const gridSize = {
      x: 10,
      y: 10,
    };

    const GetPosts = async (count: number) => {
      const edgesData = await fetch(
        "http://127.0.0.1:8090/api/collections/edges/records?perPage=100",
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
                parent: [parent],
                child: [child],
              };
            }
          )
        );

      let edgesCount: { [id: string]: number } = {};

      edgesData.forEach((edge: any) => {
        edgesCount[edge.parent] = edgesCount[edge.parent]
          ? edgesCount[edge.parent] + 1
          : 1;
      });

      const parentsSorted = Object.keys(edgesCount).sort((a, b) =>
        edgesCount[a] > edgesCount[b] ? 1 : 0
      );

      let nodeData: any = {};
      let idMap: any = {};

      let nodeIds = await fetch(
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
              const nodeId = getId();

              idMap[id] = nodeId;

              nodeData[id] = {
                id: nodeId,
                type: "post",
                data: { postStyle: "text", text: body, user: user },
                position: { x: 0, y: 0 },
                user: user,
              };

              return id;
            }
          )
        );

      type Position = { x: number; y: number };

      let closed: Position[] = [];

      const getRandomPos = () => {
        let position = { x: 0, y: 0 };

        while (closed.find(({ x, y }) => x == position.x && y == position.y)) {
          position = {
            x: Math.floor(Math.random() * gridSize.x),
            y: Math.floor(Math.random() * gridSize.y),
          };
        }

        closed.push(position);

        return position;
      };

      let placedIds: any = [];

      const filteredParents = parentsSorted.filter((parent) =>
        nodeIds.find((id: string) => id === parent)
      );

      for (const id of filteredParents) {
        placedIds.push(id);

        const position = getRandomPos();
        nodeData[id].position = position;

        const children = edgesData
          .filter(({ parent }: { parent: string }) => parent[0] === id)
          .map(({ child }: { child: string }) => child[0])
          .filter((child: string) =>
            nodeIds.find((id: string) => id === child)
          );

        for (const childId of children) {
          let attempts = 0;

          const getChildPos = () => {
            if (attempts < 20) {
              return {
                x: position.x + Math.floor(Math.random() * 3) - 1,
                y: position.y + Math.floor(Math.random() * 3) - 1,
              };
            } else if (attempts < 50) {
              return {
                x: position.x + Math.floor(Math.random() * 5) - 2,
                y: position.y + Math.floor(Math.random() * 5) - 2,
              };
            } else {
              return {
                x: position.x + Math.floor(Math.random() * 7) - 3,
                y: position.y + Math.floor(Math.random() * 7) - 3,
              };
            }
          };

          let childPosition: Position = getChildPos();

          while (
            closed.find(
              ({ x, y }) => x == childPosition.x && y == childPosition.y
            )
          ) {
            childPosition = getChildPos();
            attempts += 1;
          }

          closed.push(childPosition);
          placedIds.push(childId);

          nodeData[childId].position = childPosition;
        }
      }

      nodeIds.forEach((id: any) => {
        if (!placedIds.find((p: any) => p === id)) {
          nodeData[id].position = getRandomPos();
        }
      });

      const nodes = nodeIds
        .map((id: string) => nodeData[id])
        .map((node: any) => {
          node.position = {
            x:
              (node.position.x - gridSize.x / 2) * postRect.x +
              ((Math.random() - 0.5) * postRect.x) / 4 +
              postRect.x * 2,
            y:
              (node.position.y - gridSize.y / 2) * postRect.y +
              ((Math.random() - 0.5) * postRect.y) / 4 +
              (node.position.x % 2 == 0 ? postRect.y / 2 : 0) +
              postRect.y,
          };

          return node;
        });

      setNodes(nodes);
      setEdges(
        edgesData.map(({ parent, child }: any) => {
          return {
            id: getId(),
            type: "floating",
            source: idMap[parent],
            target: idMap[child],
          };
        })
      );
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
