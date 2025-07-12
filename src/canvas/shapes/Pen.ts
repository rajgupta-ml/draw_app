import type { RoughCanvas } from "roughjs/bin/canvas";
import { IShapeRenders } from "./baseClass";
import type {
  currentPositionType,
  PenShape,
} from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import type { Options } from "roughjs/bin/core";

export class Pen extends IShapeRenders<PenShape> {
  render(existingShape: PenShape, canvas: RoughCanvas): void {
    const config = (existingShape.config ?? shapeConfig) as Options;
    canvas.linearPath(existingShape.lineArray, config);
  }

  createShape(currentPosition: currentPositionType): PenShape {
    return {
      type: TOOLS_NAME.PEN,
      lineArray: [[currentPosition.startX, currentPosition.startY]],
    };
  }
  // Inside your Pen class

  // Helper function to calculate distance from a point to a line segment
  private distanceToSegment(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    px: number,
    py: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) { // It's a point, not a line segment
        return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    }

    const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

    let closestX, closestY;
    if (t < 0) { // Closest point is P1
        closestX = x1;
        closestY = y1;
    } else if (t > 1) { // Closest point is P2
        closestX = x2;
        closestY = y2;
    } else { // Closest point is on the segment
        closestX = x1 + t * dx;
        closestY = y1 + t * dy;
    }

    return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
  }

  // Modified isPointInLine
  isPointInLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    px: number,
    py: number,
    tolerance: number // This is your click/erase radius
  ): boolean {
    // 1. Check bounding box (optimization)
    const minX = Math.min(x1, x2) - tolerance;
    const maxX = Math.max(x1, x2) + tolerance;
    const minY = Math.min(y1, y2) - tolerance;
    const maxY = Math.max(y1, y2) + tolerance;

    if (px < minX || px > maxX || py < minY || py > maxY) {
        return false; // Point is outside the expanded bounding box
    }

    // 2. Calculate distance from the point to the line segment
    const dist = this.distanceToSegment(x1, y1, x2, y2, px, py);

    return dist <= tolerance;
  }

  // And your isPointInShape remains the same:
  isPointInShape(penShape: PenShape, px: number, py: number): boolean {
    if (penShape.lineArray.length < 2) return false;

    const detectionTolerance = (parseInt(penShape.config?.strokeWidth ?? '1') || 1) + 5;

    for (let i = 0; i < penShape.lineArray.length - 1; i++) {
        const p1 = penShape.lineArray[i];
        const p2 = penShape.lineArray[i + 1];

        if (p1 && p2) {
            // Check each segment
            if (this.isPointInLine(p1[0], p1[1], p2[0], p2[1], px, py, detectionTolerance)) {
                return true; // Found a segment that the point is on
            }
        }
    }
    return false; // No segment found
}
}
