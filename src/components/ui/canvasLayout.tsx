"use client";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import React, { useEffect } from "react";
import Toolbar from "./Toolbar";
import ZoomLayout from "./ZoomLayout";
import { Loader } from "lucide-react";
import InputLayout from "./inputLayout";
import ConfigLayout from "./configLayout";
import ConfigContextProvider from "@/context/useConfigContext";
import { SidebarContextProvider } from "@/context/useSidebar";
import { SelectedShapeProvider } from "@/context/useSelectedShape";
import {
  CanvasManagerProvider,
  useCanvasManagerContext,
} from "@/context/useCanvasManager";

const CanvasLayout = () => {
  const { width, height } = useWindowDimension();
  const {
    canvasManager,
    canvasRef,
    inputAreaRef,
    offscreenCanvasRef,
    error,
    isLoading,
  } = useCanvasManagerContext();

  useEffect(() => {
    if (
      canvasManager &&
      canvasRef.current &&
      offscreenCanvasRef.current &&
      width &&
      height
    ) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      offscreenCanvasRef.current.width = width;
      offscreenCanvasRef.current.height = height;

      canvasManager.setMaxScroll();
      canvasManager.drawCanvas();
    }
  }, [width, height, canvasManager, canvasRef, offscreenCanvasRef]);

  useEffect(() => {
    if (canvasManager && canvasRef.current) {
      canvasManager.setMaxScroll();
    }
  }, [canvasManager, canvasRef]); // Only depend on canvasManager

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
      <div className="overflow-hidden overflow-y-hidden">
        <InputLayout ref={inputAreaRef}></InputLayout>

        <canvas
          className="bg-background outline-none"
          tabIndex={0}
          ref={canvasRef}
          width={width}
          height={height}
        ></canvas>
        {/* Buffer Canvas Which is below the real canvas for performance optimization*/}
        <canvas
          ref={offscreenCanvasRef}
          width={width}
          height={height}
          style={{ display: "none" }}
        ></canvas>

        {canvasManager && (
          <>
            <Toolbar />
            <ZoomLayout />
            <ConfigLayout></ConfigLayout>
          </>
        )}
      </div>
    </>
  );
};

const CanvasLayoutWrappedWithProviders = () => {
  return (
    <SidebarContextProvider>
      <ConfigContextProvider>
        <CanvasManagerProvider>
          <SelectedShapeProvider>
            <CanvasLayout></CanvasLayout>
          </SelectedShapeProvider>
        </CanvasManagerProvider>
      </ConfigContextProvider>
    </SidebarContextProvider>
  );
};

export default CanvasLayoutWrappedWithProviders;
