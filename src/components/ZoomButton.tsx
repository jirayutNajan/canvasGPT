const ZoomButton = (
  { 
    zoomRef, 
    worldDivRef,
    offsetRef
  }: 
  { 
    zoomRef: React.RefObject<number>, 
    worldDivRef: React.RefObject<HTMLDivElement | null>,
    offsetRef: React.RefObject<{ x: number, y: number }>
  }) => {
  const handleZoom = (e: React.MouseEvent<HTMLButtonElement>, zoomIn: boolean) => {
    e.stopPropagation();
    if(zoomIn) {
      zoomRef.current += 0.05;
    }
    else zoomRef.current -= 0.05;

    worldDivRef.current!.style.transform = `scale(${zoomRef.current}) translate(${offsetRef.current.x}px, ${offsetRef.current.y}px)`;
    worldDivRef.current!.style.transformOrigin = "center center";
  }

  return (
    <div className="absolute top-2 right-10 bg-[#252525]">
      <div className="flex text-2xl items-center justify-center">
        <button 
          className="border-1 border-[#666666] px-2 cursor-pointer hover:bg-[#7b7b7b] rounded-tl-md rounded-bl-md"
          onClick={(e) => handleZoom(e, true)}
        >
          +
        </button>
        <button 
          className="border-r-1 border-t-1 border-b-1 border-[#666666] px-2 cursor-pointer 
        hover:bg-[#7b7b7b] rounded-br-md rounded-tr-md"
          onClick={(e) => handleZoom(e, false)}
        >
          -
        </button>
      </div>
    </div>
  )
}

export default ZoomButton