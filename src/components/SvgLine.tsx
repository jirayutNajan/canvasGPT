import { useRef } from "react";

export default function SvgLine() {
  const posRef = useRef({ startX: 10, startY: 50, endX: 190, endY: 50});
  const lineRef = useRef<SVGLineElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleClick = () => {
    console.log('eiei')
    posRef.current.endX += 50;
    lineRef.current?.setAttribute("x2", String(posRef.current.endX));
  }

  return (
    <svg 
      width={`${posRef.current.startX - posRef.current.endX}`} 
      height="2000" 
      onClick={handleClick} 
      ref={svgRef}
    >
      <line
        ref={lineRef}
        x1={`${posRef.current.startX}`}
        y1={`${posRef.current.startY}`}
        x2={`${posRef.current.endX}`}
        y2={`${posRef.current.endY}`}
        stroke="red"
        strokeWidth="2"
      />
    </svg>
  );
}
