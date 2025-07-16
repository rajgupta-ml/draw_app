import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Options } from 'roughjs/bin/core'

export type TextOptionsPlusGeometricOptions = Options & {
  fontFamily : string,
  fontSize : string,
  textAlignment : string,
  fontColor : string,
}
type ConfigContextType = {
  config: TextOptionsPlusGeometricOptions;
  handleConfigChange: (config : TextOptionsPlusGeometricOptions) => void;
};

const ConfigContext = createContext<ConfigContextType | null>(null);
export const ConfigContextProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TextOptionsPlusGeometricOptions>({
    maxRandomnessOffset: 2,
    roughness: 0, 
    bowing: 1,
    stroke: '#000000', 
    strokeWidth: 1, 
    curveFitting: 0.95,
    curveTightness: 0,
    curveStepCount: 9,
    fill: 'transparent', 
    fillStyle: 'hachure', 
    fillWeight: 0.5,
    hachureAngle: -45,
    hachureGap: 8,
    simplification: 0,
    dashOffset: 0,
    dashGap: 0,
    zigzagOffset: 0,
    seed: 0, 
    strokeLineDash: [], 
    strokeLineDashOffset: 0,
    fillLineDash: [],
    fillLineDashOffset: 0,
    disableMultiStroke: false,
    disableMultiStrokeFill: false,
    preserveVertices: false,
    fixedDecimalPlaceDigits: 2,
    fillShapeRoughnessGain: 1,
    fontFamily : "Arial",
    fontSize : "12px",
    textAlignment : "left",
    fontColor : "",
});
  const handleConfigChange = (config : TextOptionsPlusGeometricOptions) => {
    setConfig(config);
    window.dispatchEvent(new CustomEvent("configChange", {detail : {config}}))
  }

  return (
    <ConfigContext.Provider value={{ config, handleConfigChange }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined || context === null) {
      throw new Error('useConfig must be used within a ConfigContextProvider');
  }
  return context;
};

export default ConfigContextProvider;