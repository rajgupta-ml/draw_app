// components/CanvasLayout.tsx
"use client";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useCanvasManager } from "@/hooks/useCanvasManager";
import React, { useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import ZoomLayout from "./ZoomLayout";
import { Loader } from "lucide-react";

const CanvasLayout = () => {
  const { width = 800, height = 600 } = useWindowDimension(); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offScreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoading, canvasManager, error } = useCanvasManager(canvasRef, offScreenCanvasRef);

  useEffect(() => {
    if (canvasManager && canvasRef.current) {
      console.log("Drawing canvas with dimensions:", width, height);
      canvasManager.setMaxScroll();
      canvasManager.drawCanvas({ isScrolling: false });
    }
  }, [width, height, canvasManager]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-spin">
            <Loader></Loader>
          </div>
        </div>
      )}
      <canvas
        className="bg-background outline-none"
        tabIndex={0}
        ref={canvasRef}
        width={width}
        height={height}
      ></canvas>
      {/* Buffer Canvas Which is below the real canvas for performace optimization*/}
      <canvas 
        ref={offScreenCanvasRef}
        width={width}
        height={height}
      >
      </canvas>
      {canvasManager && (
        <>
          <Toolbar
            setTool={canvasManager.setTool}
            getTool={canvasManager.getTool}
          />
          <ZoomLayout
            getScale={canvasManager.getScale}
            scaleUp={canvasManager.scaleUp}
            scaleDown={canvasManager.scaleDown}
            undoQueue = {canvasManager.getShape}
            redoQueue = {canvasManager.getRedoShape}
            undo = {canvasManager.undo}
            redo = {canvasManager.redo}
          />
        </>
      )}
    </>
  );
};

export default CanvasLayout;