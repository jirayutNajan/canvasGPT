import { useRef, useEffect } from "react";

export default function SvgLine() {
  const pos = useRef({ startX: 10, startY: 50, endX: 190, endY: 50});
  const lineRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    if (lineRef.current) {
      // set style โดยตรง
      lineRef.current.style.stroke = "red";
      lineRef.current.style.strokeWidth = "4px";
    }
  }, []);

  return (
    <svg width="200" height="100" >
      <line
        ref={lineRef}
        x1={`${pos.current.startX}`}
        y1={`${pos.current.startY}`}
        x2={`${pos.current.endX}`}
        y2={`${pos.current.endY}`}
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
}
