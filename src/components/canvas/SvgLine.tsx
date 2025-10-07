export default function SvgLine(
  { 
    objectPos, 
    toPos, 
    toHeight,
    objectHeight
  }: 
  { 
    objectPos: { x: number, y: number }, 
    toPos: { x: number, y: number }, 
    toHeight?: number,
    objectHeight: number
  }) 
  {
    let pos: "tl" | "tr" | "bl" | "br"

  if(!toHeight) toHeight = 0;
  const width = Math.abs(objectPos.x - toPos.x);
  const height = Math.abs(Math.abs(objectPos.y - toPos.y) - toHeight)

  if(objectPos.x < toPos.x && objectPos.y < toPos.y) pos = "tl"
  else if(objectPos.x > toPos.x && objectPos.y < toPos.y) pos = "tr"
  else if(objectPos.x < toPos.x && objectPos.y > toPos.y) pos = "bl"
  else pos = "br"

  let path = "";
  let svgPos = "";
  if(pos === "bl" || pos === "tr") {
    if(pos === "bl") {
      svgPos = `translate(300px, -${height + 9}px)`
    }
    else {
      svgPos = `translate(${-width + 300}px, ${objectHeight - 7}px)`
    }

    path = `
    M 0 ${height}
    L 0 ${height*0.5 + 20}
    Q 0 ${height*0.5}
    20 ${height*0.5}
    L ${width - 20} ${height*0.5}
    Q ${width} ${height*0.5} ${width} ${height*0.5 - 20}
    L ${width} 0
    `
  }
  else {
    if(pos === "br") {
      svgPos = `translate(${-width + 300}px, -${height + 9}px)`
    }
    else {
      svgPos = `translate(300px, ${objectHeight - 7}px)`
    }

    path = `
    M 0 0
    L 0 ${height*0.5 - 20}
    Q 0 ${height*0.5} 20 ${height*0.5}
    L ${width - 20} ${height*0.5}
    Q ${width} ${height*0.5} ${width} ${height * 0.5 + 20}
    L ${width} ${height}
    `
  }

  return (
    <svg 
      width={width}
      height={height}
      style={{
        transform: svgPos,
      }}
      className="absolute cursor-auto pointer-events-none z-10"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <path
        d={path}
        stroke="#2b2b2b"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
