import type { currentPositionType } from "@/manager/CanvasManager";
import type { Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";

export interface IShapeRenders<T extends Shape> {
  createShape: (currentPosition: currentPositionType) => T;
  render: (existingShape: T, canvas: RoughCanvas) => void;
}
