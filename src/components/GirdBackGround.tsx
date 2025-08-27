import { Circle } from "react-konva";

interface GridBackGroundProps {
  width: number;
  height: number;
  stagePos: { x: number, y: number };
}

const SPACE = 70;

const GridBackGround= ({ width, height, stagePos }: GridBackGroundProps) => {
  const startX = Math.floor((-stagePos.x - width) / SPACE) * SPACE;
  const endX = Math.floor((-stagePos.x + width * 2) / SPACE) * SPACE;
  const startY = Math.floor((-stagePos.y - height) / SPACE) * SPACE;
  const endY = Math.floor((-stagePos.y + height * 2) / SPACE) * SPACE;

  const gridComponents = [];
  for (var x = startX; x < endX; x += SPACE) {
    for (var y = startY; y < endY; y += SPACE) {
      gridComponents.push(
        <Circle
          x={x}
          y={y}
          width={5}
          height={5}
          fill="white"
          opacity={0.3}
        />
      );
    }
  }

  return (
    gridComponents
  )
}

export default GridBackGround;