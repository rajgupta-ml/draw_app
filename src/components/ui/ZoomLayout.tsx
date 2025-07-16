import { useCanvasManagerContext } from "@/context/useCanvasManager";
import { Minus, Plus, Redo, Undo } from "lucide-react";
import React, { useEffect, useState } from "react";

const ZoomLayout = () => {
  const { canvasManager } = useCanvasManagerContext();

  const { scaleDown, scaleUp, getScale, undo, redo } = canvasManager;
  const [scale, setScale] = useState("100%");

  const handleZoomIn = () => {
    scaleUp();
    setScale(getScale());
  };

  const handleZoomOut = () => {
    scaleDown();
    setScale(getScale());
  };

  useEffect(() => {
    window.addEventListener("scale-change", () => setScale(getScale()));
    return () =>
      window.removeEventListener("scale-change", () => setScale(getScale()));
  }, [getScale]);
  return (
    <div className="absolute bottom-5 left-5 flex h-[30px] items-center gap-2">
      <div className="bg-sidebar border-border flex h-full w-[120px] items-center justify-between rounded-sm p-2 text-xs">
        <button className="cursor-pointer" onClick={handleZoomOut}>
          <Minus size={12} />
        </button>
        <div>{scale}</div>
        <button className="cursor-pointer" onClick={handleZoomIn}>
          <Plus size={12} />
        </button>
      </div>

      <div className="bg-sidebar flex h-full gap-5 rounded-sm p-2">
        <button className="cursor-pointer" onClick={undo}>
          <Undo size={14} />
        </button>
        <button className="cursor-pointer" onClick={redo}>
          <Redo size={14} />
        </button>
      </div>
    </div>
  );
};

export default ZoomLayout;
