import type { currentPositionType, EclipseShape } from "@/types/canvasTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { IShapeRenders } from "../baseClass";

export class Ellipse extends IShapeRenders<EclipseShape> {
  render = (existingShape: EclipseShape, canvas: RoughCanvas) => {
    canvas.ellipse(
      existingShape.x,
      existingShape.y,
      existingShape.w,
      existingShape.h,
      shapeConfig,
    );
  };

  createShape = (currentPosition: currentPositionType): EclipseShape => {
    const x = Math.min(currentPosition.startX, currentPosition.endX);
    const y = Math.min(currentPosition.startY, currentPosition.endY);
    const w = Math.abs(currentPosition.startX - currentPosition.endX);
    const h = Math.abs(currentPosition.startY - currentPosition.endY);

    return { type: TOOLS_NAME.ECLIPSE, x, y, w, h };
  };

  isPointInShape(shape: EclipseShape, px: number, py: number): boolean {
    return true;
  }
}
