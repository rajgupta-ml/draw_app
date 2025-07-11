import { useEffect, useState } from "react";

type WindowDimesion = {
  width: number;
  height: number;
};
export const useWindowDimension = () => {
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

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: windowDimesion?.width ?? 0,
    height: windowDimesion?.height ?? 0,
  };
};
