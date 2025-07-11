// hooks/useCanvasManager.ts
import { CanvasManager } from "@/manager/CanvasManager";
import { useEffect, useRef, useState } from "react";

export const useCanvasManager = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [canvasManager, setCanvasManager] = useState<CanvasManager | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas ref is null, delaying initialization");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError(new Error("Failed to get 2D context"));
      setIsLoading(false);
      return;
    }

    console.log("Initializing CanvasManager with canvas and ctx:", canvas, ctx);
    const manager = new CanvasManager(canvas, ctx);
    manager.addEventListeners();
    setCanvasManager(manager);
    setIsLoading(false);

    return () => {
      console.log("Cleaning up CanvasManager");
      manager.destroyEventListeners();
      setCanvasManager(null);
    };
  }, [canvasRef]); // Re-run when canvasRef changes

  return { isLoading, canvasManager, error };
};