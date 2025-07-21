"use clients";
import React, { useEffect, useRef, type ReactNode } from "react";
import {
  useConfig,
  type TextOptionsPlusGeometricOptions,
} from "@/context/useConfigContext";
import useSidebar from "@/context/useSidebar";
import { GeometricConfig } from "./configLayout/GeometricConfigLayout";
import { TextConfig } from "./configLayout/TextConfigLayout";
import { useTheme } from "next-themes";
import { strokeColor } from "./configLayout/constant";
import { useSelectedShape } from "@/context/useSelectedShape";
import { useCanvasManagerContext } from "@/context/useCanvasManager";
import { UpdateCommand } from "@/canvas/UndoAndRedoCmd/ShapeCommand";

const ConfigLayout = () => {
  const { config, handleConfigChange, setConfig } = useConfig();
  const { canvasManager } = useCanvasManagerContext();
  const { executeCmd } = canvasManager;
  const { showSidebar } = useSidebar();
  const { resolvedTheme } = useTheme();
  const { selectedShape } = useSelectedShape();
  const prevConfig = useRef<TextOptionsPlusGeometricOptions | null>(null)

  useEffect(() => {
    handleConfigChange({
      ...config,
      stroke:
        resolvedTheme === "dark" ? strokeColor.dark[0] : strokeColor.light[0],
    });
  }, [resolvedTheme]);

  useEffect(() => {
    prevConfig.current =selectedShape?.config ?? null;
    if (selectedShape && selectedShape.config) {
      setConfig((prevConfig: TextOptionsPlusGeometricOptions) => ({
        ...prevConfig,
        ...selectedShape.config,
      }));
    }

    console.log(selectedShape)
  }, [selectedShape]);

  useEffect(() => {

    if (JSON.stringify(prevConfig.current) === JSON.stringify(config)) {
      return;
    }
    if (selectedShape && selectedShape.config) {
      executeCmd(new UpdateCommand(canvasManager, selectedShape, config));
    }
    prevConfig.current = config;
  }, [config]);

  if (showSidebar === null) return null;

  return (
    <>
      {showSidebar === "geometry" ? (
        <ConfigContainer>
          <GeometricConfig />
        </ConfigContainer>
      ) : (
        <ConfigContainer>
          <TextConfig />
        </ConfigContainer>
      )}
    </>
  );
};

export default ConfigLayout;

const ConfigContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute top-1/2 left-5 min-w-[200px] -translate-y-1/2">
      <div className="bg-sidebar shadow-accent-foreground flex h-full w-full flex-col gap-3 rounded-2xl p-4 shadow-2xl">
        {children}
      </div>
    </div>
  );
};
