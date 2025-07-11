import type { RoughCanvas } from "roughjs/bin/canvas";
import { IShapeRenders } from "./baseClass";
import type { currentPositionType, RightArrowShape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { shapeConfig } from "@/constants/canvasConstant";

export class RightArrow extends IShapeRenders<RightArrowShape> {
  createShape(currentPosition: currentPositionType): RightArrowShape {
    return {
      type: TOOLS_NAME.RIGHT_ARROW,
      startX: currentPosition.startX,
      startY: currentPosition.startY,
      endX: currentPosition.endX,
      endY: currentPosition.endY,
    };
  }

  render(existingShape: RightArrowShape, canvas: RoughCanvas): void {
    const { startX, startY, endX, endY, config } = existingShape;

    // Calculate vector properties
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx); // Angle in radians

    const arrowheadLength = (Number(config?.arrowheadLength) || 20) as number;
    const arrowheadWidth = (Number(config?.arrowheadWidth) || 20) as number;

    let effectiveShaftLength = length - arrowheadLength;

    if (effectiveShaftLength < 0) {
      if (length < arrowheadLength / 2) {
        canvas.line(startX, startY, endX, endY, config);
        return;
      } else {
        const scaleFactor = length / arrowheadLength;
        const scaledArrowheadLength = arrowheadLength * scaleFactor * 0.8;
        const scaledArrowheadWidth = arrowheadWidth * scaleFactor * 0.8;
        effectiveShaftLength = length - scaledArrowheadLength;
        this._drawArrowPath(
          canvas,
          startX,
          startY,
          endX,
          endY,
          effectiveShaftLength,
          scaledArrowheadLength,
          scaledArrowheadWidth,
          angle,
          config,
        );
      }
    } else {
      this._drawArrowPath(
        canvas,
        startX,
        startY,
        endX,
        endY,
        effectiveShaftLength,
        arrowheadLength,
        arrowheadWidth,
        angle,
        config,
      );
    }
  }

  private _drawArrowPath(
    canvas: RoughCanvas,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    shaftLength: number,
    arrowheadLength: number,
    arrowheadWidth: number,
    angle: number,
    options?: any,
  ): void {
    // Calculate the end point of the shaft (where the arrowhead begins)
    const shaftEndX = startX + shaftLength * Math.cos(angle);
    const shaftEndY = startY + shaftLength * Math.sin(angle);

    // Tip of the arrowhead is the end point
    const tipX = endX;
    const tipY = endY;

    // Calculate the two base points of the arrowhead triangle
    const basePoint1X =
      tipX -
      arrowheadLength * Math.cos(angle) +
      (arrowheadWidth / 2) * Math.sin(angle);
    const basePoint1Y =
      tipY -
      arrowheadLength * Math.sin(angle) -
      (arrowheadWidth / 2) * Math.cos(angle);

    const basePoint2X =
      tipX -
      arrowheadLength * Math.cos(angle) -
      (arrowheadWidth / 2) * Math.sin(angle);
    const basePoint2Y =
      tipY -
      arrowheadLength * Math.sin(angle) +
      (arrowheadWidth / 2) * Math.cos(angle);

    // Draw the main shaft line
    canvas.line(startX, startY, shaftEndX, shaftEndY, shapeConfig);

    // Add a second, slightly offset line for the shaft to create the "double line" effect
    const offsetAmount = 2; // Adjust this value for desired separation
    const offsetX = offsetAmount * Math.sin(angle);
    const offsetY = -offsetAmount * Math.cos(angle);
    canvas.line(
      startX + offsetX,
      startY + offsetY,
      shaftEndX + offsetX,
      shaftEndY + offsetY,
      shapeConfig,
    );

    // Draw the two lines for the arrowhead (creating an open, non-filled arrowhead)
    canvas.line(tipX, tipY, basePoint1X, basePoint1Y, shapeConfig);
    canvas.line(tipX, tipY, basePoint2X, basePoint2Y, shapeConfig);
  }

  isPointInShape(shape: RightArrowShape, px: number, py: number): boolean {
    return this.isPointInLine(
      shape.startX,
      shape.endX,
      shape.startY,
      shape.endY,
      px,
      py,
    );
  }
}
