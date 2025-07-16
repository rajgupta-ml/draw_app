import { IShapeRenders } from "./baseClass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { currentPositionType, DiamondShape } from "@/types/canvasTypes";
import { DEFAULT_CONFIG, shapeConfig } from "@/constants/canvasConstant";
import type { Options } from "roughjs/bin/core";

export class Diamond extends IShapeRenders<DiamondShape> {
  createShape(currentPosition: currentPositionType): DiamondShape {
    const x = Math.min(currentPosition.startX, currentPosition.endX);
    const y = Math.min(currentPosition.startY, currentPosition.endY);
    const w = Math.abs(currentPosition.startX - currentPosition.endX);
    const h = Math.abs(currentPosition.startY - currentPosition.endY);
    return {
      type: TOOLS_NAME.DIAMOND,
      x,
      y,
      w,
      h,
      config: DEFAULT_CONFIG,
    };
  }

  render(existingShape: DiamondShape, canvas: RoughCanvas) {
    const { x, y, w, h, config } = existingShape;

    const configValue = (config ?? shapeConfig) as Options;

    // Calculate the four diamond points
    // Top point
    const p1x = x + w / 2;
    const p1y = y;

    // Right point
    const p2x = x + w;
    const p2y = y + h / 2;

    // Bottom point
    const p3x = x + w / 2;
    const p3y = y + h;

    // Left point
    const p4x = x;
    const p4y = y + h / 2;

    const diamondPathData = `
        M ${p1x} ${p1y}
        L ${p2x} ${p2y}
        L ${p3x} ${p3y}
        L ${p4x} ${p4y}
        Z
      `;

    // Draw the diamond path using rough.js
    canvas.path(diamondPathData, configValue);
  }

  isPointInShape(shape: DiamondShape, px: number, py: number): boolean {
    const p1x = shape.x + shape.w / 2;
    const p1y = shape.y;

    // Right point
    const p2x = shape.x + shape.w;
    const p2y = shape.y + shape.h / 2;

    // Bottom point
    const p3x = shape.x + shape.w / 2;
    const p3y = shape.y + shape.h;

    // Left point
    const p4x = shape.x;
    const p4y = shape.y + shape.h / 2;

    const segment1 = this.isPointInLine(p1x, p2x, p1y, p2y, px, py);
    const segment2 = this.isPointInLine(p2x, p3x, p2y, p3y, px, py);
    const segment3 = this.isPointInLine(p3x, p4x, p3y, p4y, px, py);
    const segment4 = this.isPointInLine(p4x, p1x, p4y, p1y, px, py);

    return segment1 || segment2 || segment3 || segment4;
  }
}
