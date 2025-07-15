import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Options } from 'roughjs/bin/core'

type ConfigContextType = {
  config: Options;
  setConfig: React.Dispatch<React.SetStateAction<Options>>;
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigContextProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Options>({
    maxRandomnessOffset: 2,
    roughness: 1, 
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
});

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
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