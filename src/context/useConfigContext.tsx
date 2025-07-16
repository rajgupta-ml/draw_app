import { DEFAULT_CONFIG } from "@/constants/canvasConstant";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Options } from "roughjs/bin/core";

export type TextOptionsPlusGeometricOptions = Options & {
  fontFamily: string;
  fontSize: string;
  textAlignment: string;
};
type ConfigContextType = {
  config: TextOptionsPlusGeometricOptions;
  handleConfigChange: (config: TextOptionsPlusGeometricOptions) => void;
  setConfig: React.Dispatch<
    React.SetStateAction<TextOptionsPlusGeometricOptions>
  >;
};

const ConfigContext = createContext<ConfigContextType | null>(null);
export const ConfigContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [config, setConfig] =
    useState<TextOptionsPlusGeometricOptions>(DEFAULT_CONFIG);
  const handleConfigChange = (config: TextOptionsPlusGeometricOptions) => {
    setConfig(config);
    window.dispatchEvent(
      new CustomEvent("configChange", { detail: { config } }),
    );
  };

  return (
    <ConfigContext.Provider value={{ config, handleConfigChange, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined || context === null) {
    throw new Error("useConfig must be used within a ConfigContextProvider");
  }
  return context;
};

export default ConfigContextProvider;
