import type { RoughCanvas } from "roughjs/bin/canvas";
import { IShapeRenders } from "./baseClass";
import type { currentPositionType, RightArrowShape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { DEFAULT_CONFIG, shapeConfig } from "@/constants/canvasConstant";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

export class RightArrow extends IShapeRenders<RightArrowShape> {
  createShape(currentPosition: currentPositionType): RightArrowShape {
    return {
      type: TOOLS_NAME.RIGHT_ARROW,
      startX: currentPosition.startX,
      startY: currentPosition.startY,
      endX: currentPosition.endX,
      endY: currentPosition.endY,
      config: DEFAULT_CONFIG,
    };
  }

  render(existingShape: RightArrowShape, canvas: RoughCanvas): void {
    const { startX, startY, endX, endY, config } = existingShape;
    const configValue = config ?? shapeConfig;
    // Calculate vector properties
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx); // Angle in radians

    const arrowheadLength = 20;
    const arrowheadWidth = 20;

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
          configValue,
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
        configValue,
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
    options: TextOptionsPlusGeometricOptions,
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
    canvas.line(startX, startY, shaftEndX, shaftEndY, options);

    // Add a second, slightly offset line for the shaft to create the "double line" effect
    const offsetAmount = 2; // Adjust this value for desired separation
    const offsetX = offsetAmount * Math.sin(angle);
    const offsetY = -offsetAmount * Math.cos(angle);
    canvas.line(
      startX + offsetX,
      startY + offsetY,
      shaftEndX + offsetX,
      shaftEndY + offsetY,
      options,
    );

    // Draw the two lines for the arrowhead (creating an open, non-filled arrowhead)
    canvas.line(tipX, tipY, basePoint1X, basePoint1Y, options);
    canvas.line(tipX, tipY, basePoint2X, basePoint2Y, options);
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
