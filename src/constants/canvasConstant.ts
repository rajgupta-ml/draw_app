import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

export const shapeConfig = {
  roughness: "2",
  stroke: "white",
  seed: "1",
};

export const eraserShapeConfig: Pick<
  TextOptionsPlusGeometricOptions,
  "roughness" | "stroke" | "seed"
> = {
  stroke: "gray",
};

export const DEFAULT_CONFIG = {
  maxRandomnessOffset: 2,
  roughness: 0,
  bowing: 1,
  stroke: "#000000",
  strokeWidth: 1,
  curveFitting: 0.95,
  curveTightness: 0,
  curveStepCount: 9,
  fill: "transparent",
  fillStyle: "hachure",
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
  fontFamily: "Arial",
  fontSize: "12",
  textAlignment: "left",
};
