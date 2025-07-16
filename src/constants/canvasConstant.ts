import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

export const shapeConfig = {
  roughness: "2",
  stroke: "white",
  seed: "1",
};

export const eraserShapeConfig : Pick<TextOptionsPlusGeometricOptions, "roughness" | "stroke" | "seed"> = {
  stroke: "gray",
}
