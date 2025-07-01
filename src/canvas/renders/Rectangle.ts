import type { currentPositionType, RectShape } from "@/types/canvasTypes";
import { IShapeRenders } from "../baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { shapeConfig } from "@/constants/canvasConstant";
import { TOOLS_NAME } from "@/types/toolsTypes";
export class Rectangle extends IShapeRenders<RectShape> {
  render = (existingShape: RectShape, canvas: RoughCanvas) => {
    canvas.rectangle(
      existingShape.x,
      existingShape.y,
      existingShape.w,
      existingShape.h,
      shapeConfig,
    );
  };

  createShape = (currentPosition: currentPositionType): RectShape => {
    const x = Math.min(currentPosition.startX, currentPosition.endX);
    const y = Math.min(currentPosition.startY, currentPosition.endY);
    const w = Math.abs(currentPosition.startX - currentPosition.endX);
    const h = Math.abs(currentPosition.startY - currentPosition.endY);
    return { type: TOOLS_NAME.RECT, x, y, w, h };
  };
  isPointInShape(shape: RectShape, px: number, py: number): boolean {
    const topLeftX = shape.x;
    const topLeftY = shape.y;
    const topRightX = shape.x + shape.w;
    const topRightY = shape.y;  
    const bottomLeftX = shape.x;
    const bottomLeftY = shape.y + shape.h; // CORRECTED: Add height for bottom Y
    const bottomRightX = shape.x + shape.w;
    const bottomRightY = shape.y + shape.h; // CORRECTED: Add height for bottom Y    

    const topLineSegment = this.isPointInLine(topLeftX, topRightX, topLeftY, topRightY, px,py);
    const bottomLineSegment = this.isPointInLine(bottomLeftX, bottomRightX, bottomLeftY, bottomRightY,px,py)
    const leftLineSegment = this.isPointInLine(topLeftX, bottomLeftX, topLeftY, bottomLeftY, px,py);
    const rightLineSegment = this.isPointInLine(topRightX, bottomRightX, topRightY, bottomRightY, px, py);

  
    return (topLineSegment || bottomLineSegment || leftLineSegment || rightLineSegment)
      
  }
}
