// hooks/useCanvasManager.ts
import { useConfig } from "@/context/useConfigContext";
import useSidebar from "@/context/useSidebar";
import { CanvasManager } from "@/manager/CanvasManager";
import { useEffect, useState } from "react";

export const useCanvasManager = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>, 
  offscreenCanvasRef : React.RefObject<HTMLCanvasElement | null>,
  inputAreaRef : React.RefObject<HTMLDivElement | null>
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [canvasManager, setCanvasManager] = useState<CanvasManager | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const {toggleSidebar} = useSidebar()

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current
    const inputArea = inputAreaRef.current
    if (!canvas || !offscreenCanvas || !inputArea) {
      console.log("Canvas ref is null, delaying initialization");
      return;
    }

    const ctx = canvas.getContext("2d");
    const offscreenCanvasCtx = offscreenCanvas.getContext("2d");
    if (!ctx || !offscreenCanvasCtx) {
      setError(new Error("Failed to get 2D context"));
      setIsLoading(false);
      return;
    }

    console.log("Initializing CanvasManager with canvas and ctx:", canvas, ctx);
    const manager = new CanvasManager(canvas, ctx, offscreenCanvas, offscreenCanvasCtx, inputArea, toggleSidebar);
    manager.addEventListeners();
    setCanvasManager(manager);
    setIsLoading(false);

    return () => {
      console.log("Cleaning up CanvasManager");
      manager.destroyEventListeners();
      setCanvasManager(null);
    };
  }, [canvasRef]); 

  return { isLoading, canvasManager, error };
};