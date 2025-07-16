import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { CanvasManager } from "@/manager/CanvasManager";
import useSidebar from "@/context/useSidebar";
import { useConfig } from "@/context/useConfigContext";

interface CanvasManagerContextType {
  canvasManager: CanvasManager | null;
  isLoading: boolean;
  error: Error | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  offscreenCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  inputAreaRef: React.RefObject<HTMLDivElement | null>;
}

const CanvasManagerContext = createContext<
  CanvasManagerContextType | undefined
>(undefined);

export const useCanvasManagerContext = () => {
  const context = useContext(CanvasManagerContext);
  if (context === undefined) {
    throw new Error(
      "useCanvasManagerContext must be used within a CanvasManagerProvider",
    );
  }

  return context as Omit<CanvasManagerContextType, "canvasManager"> & {
    canvasManager: CanvasManager;
  };
};

interface CanvasManagerProviderProps {
  children: React.ReactNode;
}

export const CanvasManagerProvider: React.FC<CanvasManagerProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasManager = useRef<CanvasManager | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const { toggleSidebar } = useSidebar();
  const { config } = useConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    const inputArea = inputAreaRef.current;

    if (!canvas || !offscreenCanvas || !inputArea) {
      console.log(
        "Canvas or input area ref is null, delaying CanvasManager initialization.",
      );
      return;
    }

    const ctx = canvas.getContext("2d");
    const offscreenCanvasCtx = offscreenCanvas.getContext("2d");
    if (!ctx || !offscreenCanvasCtx) {
      setError(new Error("Failed to get 2D context from canvas elements."));
      setIsLoading(false);
      return;
    }

    try {
      if (canvasManager.current === null) {
        const manager = new CanvasManager(
          canvas,
          ctx,
          offscreenCanvas,
          offscreenCanvasCtx,
          inputArea,
          config,
          toggleSidebar,
        );
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        offscreenCanvas.width = window.innerWidth;
        offscreenCanvas.height = window.innerHeight;
        manager.addEventListeners();
        manager.drawCanvas();
        canvasManager.current = manager;
        setIsLoading(false);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e
          : new Error("Unknown error initializing CanvasManager."),
      );
      setIsLoading(false);
    }

    return () => {
      if (canvasManager.current) {
        canvasManager.current.destroyEventListeners();
        canvasManager.current = null;
      }
      setIsLoading(true);
    };
  }, []);

  const contextValue = {
    canvasManager: canvasManager.current,
    isLoading,
    error,
    canvasRef,
    offscreenCanvasRef,
    inputAreaRef,
  };

  return (
    <CanvasManagerContext.Provider value={contextValue}>
      {children}
    </CanvasManagerContext.Provider>
  );
};
