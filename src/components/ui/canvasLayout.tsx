"use client";
import { useWindowDimesion } from "@/hooks/useWindowDimension";
import { CanvasManager } from "@/manager/CanvasManager";
import React, { useEffect, useRef, useState } from "react";

const CanvasLayout = () => {
  const { width, height } = useWindowDimesion();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasManager, setCanavsManager] = useState<CanvasManager>()

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas ) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    setIsCanvasReady(true);
    setCanavsManager(new CanvasManager(canvas, ctx));
    canvasManager?.addEventListners();
    canvasManager?.drawCanvas();

    return () => {
      canvasManager?.destroyEventListners();
    }
  }, [width, height, isCanvasReady]);

  return (
    <canvas
      className="bg-background"
      ref={canvasRef}
      width={width}
      height={height}
    ></canvas>
  );
};

export default CanvasLayout;