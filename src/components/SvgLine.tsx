export default function SvgLine(
  { 
    objectPos, 
    toPos, 
    toHeight,
  }: 
  { 
    objectPos: { x: number, y: number }, 
    toPos: { x: number, y: number }, 
    toHeight?: number,
  }) 
  {
  if(!toHeight) toHeight = 0;
  const width = Math.abs(objectPos.x - toPos.x);
  const height = Math.abs(objectPos.y - toPos.y) - toHeight

  // TODO กลับข้าง บน ซ้าย ขวา path

  return (
    <svg 
      width={width}
      height={height}
      style={{
        transform: `translate(300px, -${height + 9}px)`,
      }}
      className="absolute cursor-auto pointer-events-none"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <path
        d={`
          M ${2} ${height}
          L 2 ${height*0.6}
          Q 2 ${height*0.5}
          22 ${height*0.5}
          L ${width - 22} ${height*0.5}
          Q ${width - 2} ${height*0.5}
          ${width - 2} ${height*0.4}
          L ${width - 2} 0
        `}
        stroke="#2b2b2b"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
