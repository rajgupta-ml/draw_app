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
import { useSearchParams } from "next/navigation";
import { QUERY } from "@/api/shareableApi";
import WarningDialog from "./WarningDialog";
import socketManager, { SocketManager } from "@/manager/socketManager";
import { generateMessage } from "@/lib/generateMessge";

const CanvasLayout = ({id, roomId} : {id  :string | null, roomId : string | null}) => {
  const { width, height } = useWindowDimension();
  const [warning, setWarning] = useState(false);
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
      enabled: !!id ,
      staleTime: 0,     
      refetchOnMount: true,
      refetchOnWindowFocus: false,
  });

  const {data : RoomShapeData} = useQuery({
    queryKey: ['shapeData', roomId],
    queryFn: getShapeData,
    enabled: !!roomId ,
    staleTime: 0,     
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
  useEffect(() => {
    if(!roomId) return;
    socketManager.setName = "new-user",
    socketManager.setRoomId = roomId
    socketManager.joinRoom();
    console.log(RoomShapeData)
    if(RoomShapeData && canvasManager){
      canvasManager.shapes = JSON.parse(RoomShapeData.json)
    }

  },[canvasManager, data, canvasRef])

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
  const roomId = searchParams.get("roomId")

  return (
    <QueryClientProvider client={queryClient}>

    <SidebarContextProvider>
      <ConfigContextProvider>
        <CanvasManagerProvider>
          <SelectedShapeProvider>
            <CanvasLayout id = {id} roomId = {roomId}></CanvasLayout>
          </SelectedShapeProvider>
        </CanvasManagerProvider>
      </ConfigContextProvider>
    </SidebarContextProvider>
    </QueryClientProvider>
  );
};

export default CanvasLayoutWrappedWithProviders;
