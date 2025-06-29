import { useEffect, useState } from "react";

type WindowDimesion = {
  width: number;
  height: number;
};
export const useWindowDimesion = () => {
  const [windowDimesion, setWindowDimesion] = useState<WindowDimesion>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setWindowDimesion({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    setWindowDimesion({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return {
    width: windowDimesion?.width ?? 0,
    height: windowDimesion?.height ?? 0,
  };
};
