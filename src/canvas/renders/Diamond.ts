import type { currentPositionType } from "@/manager/CanvasManager";
import type { IShapeRenders } from "../baseClass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DiamondShape } from "@/types/canvasTypes";
import { shapeConfig } from "@/constants/canvasConstant";

export class Diamond implements IShapeRenders<DiamondShape> {

    createShape(currentPosition: currentPositionType): DiamondShape {
      const x = Math.min(currentPosition.startX, currentPosition.endX);
      const y = Math.min(currentPosition.startY, currentPosition.endY);
      const w = Math.abs(currentPosition.startX - currentPosition.endX);
      const h = Math.abs(currentPosition.startY - currentPosition.endY)
      return {
        type: TOOLS_NAME.DIAMOND,
        x,y,w,h
      };
    }
  
    render(existingShape: DiamondShape, canvas: RoughCanvas) {
      const { x,y,w,h,config } = existingShape;
  
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
    canvas.path(diamondPathData, shapeConfig);
    }
  }