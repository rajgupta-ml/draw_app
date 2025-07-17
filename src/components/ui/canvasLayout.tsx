"use client";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import React, { useEffect, useState } from "react";
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
import ShareButton from "./ShareButton";
import { ThemeToggle } from "./ToggleTheme";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { QUERY } from "@/api/shareableApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import WarningDialog from "./WarningDialog";

const CanvasLayout = ({id} : {id  :string | null}) => {
  const { width, height } = useWindowDimension();
  const [warning, setWarning] = useState(false);
  const pathname = usePathname();
  const {getShapeData} = QUERY;
  const {
    canvasManager,
    canvasRef,
    inputAreaRef,
    offscreenCanvasRef,
    error,
    isLoading,
  } = useCanvasManagerContext();

  

  const { data } = useQuery({
      queryKey: ['shapeData', id],
      queryFn: getShapeData,
      enabled: !!id,
      staleTime: 0,     
      refetchOnMount: true,
      refetchOnWindowFocus: false,
  });


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
      // Get the data and set the shapes
      // Check if there is something is localstroage if there is open a warning box
      if(data){
        const oldShape = window.localStorage.getItem("shape");
        if(oldShape){
          setWarning(true);
          const shapeData = JSON.parse(data.json)
          canvasManager.shapes = shapeData;
        }
      }
      canvasManager.setMaxScroll();
    }
  }, [canvasManager, canvasRef, data]); 

  const handleDelete = () => {
    window.localStorage.removeItem("shape");
    const shapeData = JSON.parse(data.json)
    if(shapeData){
      canvasManager.shapes = shapeData;
      canvasManager.drawCanvas();
    }
    setWarning(false);
  }

  

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
    <WarningDialog handleDelete={handleDelete} setWarning={setWarning} warning={warning}></WarningDialog>
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
          <div className="absolute top-5 right-20 z-10 flex items-center gap-4 ">
            <ThemeToggle></ThemeToggle>
            <ShareButton></ShareButton>
          </div>
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
  const queryClient = new QueryClient()
  const searchParams = useSearchParams();
  const id = searchParams.get("id")

  return (
    <QueryClientProvider client={queryClient}>

    <SidebarContextProvider>
      <ConfigContextProvider>
        <CanvasManagerProvider>
          <SelectedShapeProvider>
            <CanvasLayout id = {id}></CanvasLayout>
          </SelectedShapeProvider>
        </CanvasManagerProvider>
      </ConfigContextProvider>
    </SidebarContextProvider>
    </QueryClientProvider>
  );
};

export default CanvasLayoutWrappedWithProviders;
