import type { currentPositionType, LineShape } from "@/types/canvasTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { IShapeRenders } from "../baseClass";

export class Line extends IShapeRenders<LineShape> {
  render = (existingShape: LineShape, canvas: RoughCanvas) => {
    canvas.line(
      existingShape.x1,
      existingShape.y1,
      existingShape.x2,
      existingShape.y2,
      shapeConfig,
    );
  };

  createShape = (currentPosition: currentPositionType): LineShape => {
    const x1 = currentPosition.startX;
    const y1 = currentPosition.startY;
    const x2 = currentPosition.endX;
    const y2 = currentPosition.endY;

    return { type: TOOLS_NAME.LINE, x1, y1, x2, y2 };
  };

  isPointInShape(shape: LineShape, px: number, py: number): boolean {
    return this.isPointInLine(shape.x1, shape.x2, shape.y1, shape.y2, px,py)
  }
}
