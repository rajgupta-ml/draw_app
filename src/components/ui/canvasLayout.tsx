"use client";
import { useWindowDimesion } from "@/hooks/useWindowDimension";
import { CanvasManager } from "@/manager/CanvasManager";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

const CanvasLayout = () => {
  const { width, height } = useWindowDimesion();
  const canvasManager = useRef<CanvasManager>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || canvasManager.current ) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    
    canvasManager.current = new CanvasManager(canvas, ctx)
    canvasManager.current.addEventListners();
    return () => {
      canvasManager.current?.destroyEventListners()
      canvasManager.current = null;
    };
  }, []);

  return (
    <>
      <Toolbar setTool = {canvasManager.current?.setTool} getTool = {canvasManager.current?.getTool}/>
      <canvas
      className="bg-background"
      ref={canvasRef}
      width={width}
      height={height}
      ></canvas>
    </>
  );
};

export default CanvasLayout;