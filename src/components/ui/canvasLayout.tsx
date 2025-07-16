"use client";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useCanvasManager } from "@/hooks/useCanvasManager";
import React, { useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import ZoomLayout from "./ZoomLayout";
import { Loader } from "lucide-react";
import InputLayout from "./inputLayout";
import ConfigLayout from "./configLayout";
import ConfigContextProvider, { useConfig } from "@/context/useConfigContext";
import { SidebarContextProvider } from "@/context/useSidebar";

const CanvasLayout = () => {
  const { width = 800, height = 600 } = useWindowDimension(); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const offScreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoading, canvasManager, error } = useCanvasManager(canvasRef, offScreenCanvasRef, inputAreaRef);
  const {config, handleConfigChange} = useConfig();
  useEffect(() => {
    if (canvasManager && canvasRef.current) {
      canvasManager.setMaxScroll();
      canvasManager.drawCanvas({ isScrolling: false });   
      // This is to only intial send the config;
      handleConfigChange({...config});
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
      <div className="overflow-hidden overflow-y-hidden">
      <InputLayout ref = {inputAreaRef}></InputLayout>
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
        style={{ display: 'none' }} 
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
        <ConfigContextProvider>
          <ConfigLayout></ConfigLayout>
        </ConfigContextProvider>
        </>
      )}
      </div>
    </>
  );
};



 const CanvasLayoutWrappedWithProviders = () => {
  return(

    <SidebarContextProvider>
      <ConfigContextProvider>
        <CanvasLayout></CanvasLayout>
      </ConfigContextProvider>
    </SidebarContextProvider>
  )
}

export default CanvasLayoutWrappedWithProviders;