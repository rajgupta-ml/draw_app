// components/CanvasLayout.tsx
"use client";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useCanvasManager } from "@/hooks/useCanvasManager";
import React, { useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import ZoomLayout from "./ZoomLayout";

const CanvasLayout = () => {
  const { width = 800, height = 600 } = useWindowDimension(); // Default dimensions
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoading, canvasManager, error } = useCanvasManager(canvasRef);

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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          Loading...
        </div>
      )}
      <canvas
        className="bg-background"
        ref={canvasRef}
        width={width}
        height={height}
      ></canvas>
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
          />
        </>
      )}
    </>
  );
};

export default CanvasLayout;