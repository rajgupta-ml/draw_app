"use client";
import { useWindowDimesion } from "@/hooks/useWindowDimension";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const CanvasLayout = () => {
  const [isloading, setIsLoading] = useState(true);
  const { width, height } = useWindowDimesion();
  const CanvasRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isloading || width == 0 || height == 0) {
    <Loader></Loader>;
  }

  return (
    <canvas
      className="bg-background"
      ref={CanvasRef}
      width={width}
      height={height}
    ></canvas>
  );
};

const Loader = () => {
  return (
    <div>
      <Loader2></Loader2>
    </div>
  );
};

export default CanvasLayout;
