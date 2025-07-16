import type { currentPositionType, EclipseShape } from "@/types/canvasTypes";
import { DEFAULT_CONFIG, shapeConfig } from "@/constants/canvasConstant";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { IShapeRenders } from "./baseClass";
import type { Options } from "roughjs/bin/core";

export class Ellipse extends IShapeRenders<EclipseShape> {
  render = (existingShape: EclipseShape, canvas: RoughCanvas) => {
    const config = (existingShape.config ?? shapeConfig) as Options;
    canvas.ellipse(
      existingShape.x,
      existingShape.y,
      existingShape.w,
      existingShape.h,
      config,
    );
  };

  createShape = (currentPosition: currentPositionType): EclipseShape => {
    const x = (currentPosition.startX + currentPosition.endX) / 2;
    const y = (currentPosition.startY + currentPosition.endY) / 2;
    // Calculate the total width and height based on the drag distance
    const w = Math.abs(currentPosition.startX - currentPosition.endX);
    const h = Math.abs(currentPosition.startY - currentPosition.endY);

    return { type: TOOLS_NAME.ECLIPSE, x, y, w, h, config: DEFAULT_CONFIG };
  };

  isPointInShape(shape: EclipseShape, px: number, py: number): boolean {
    const cx = shape.x; // Center x
    const cy = shape.y; // Center y
    const a = shape.w / 2; // Semi-major axis
    const b = shape.h / 2; // Semi-minor axis
    if (a === 0 || b === 0) {
      return false;
    }
    const value =
      Math.pow(px - cx, 2) / Math.pow(a, 2) +
      Math.pow(py - cy, 2) / Math.pow(b, 2);
    return value <= 1;
  }
}
