import { useEffect, useRef } from "react";

export default function SvgLine(
  { 
    setSvgAndPathRef
  }: 
  { 
    setSvgAndPathRef: (svg: SVGSVGElement, path: SVGPathElement) => void
  }) 
  {

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if(svgRef.current && pathRef.current) {
      setSvgAndPathRef(svgRef.current, pathRef.current)
    }
  }, [])

  return (
    <svg 
      ref={svgRef}
      className="absolute cursor-auto pointer-events-none z-10"
      onMouseDown={(e) => e.stopPropagation()}
      >
      <path
        ref={pathRef}
        stroke="#2b2b2b"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}