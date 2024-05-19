import { getBezierPath } from "reactflow";
import getEdgeParams from "./EdgeParams.ts";

function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: {
  toX: number;
  toY: number;
  fromPosition: any;
  toPosition: any;
  fromNode: any;
}) {
  if (!fromNode) {
    return null;
  }

  const targetNode = {
    id: "connection-target",
    width: 1,
    height: 1,
    positionAbsolute: { x: toX, y: toY },
  };

  const { sx, sy } = getEdgeParams(fromNode, targetNode);
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={6}
        strokeDasharray={20}
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default FloatingConnectionLine;
