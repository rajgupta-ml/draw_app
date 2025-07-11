import type { RoughCanvas } from "roughjs/bin/canvas";
import { IShapeRenders } from "./baseClass";
import type { currentPositionType, LineShape, PenShape } from "@/types/canvasTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import { TOOLS_NAME } from "@/types/toolsTypes";

export class Pen extends IShapeRenders<PenShape> {
    render(existingShape: PenShape, canvas: RoughCanvas): void {
        canvas.linearPath(existingShape.lineArray, shapeConfig)
    }

    createShape(currentPosition: currentPositionType): PenShape {
        return {
            type : TOOLS_NAME.PEN,
            lineArray : [[currentPosition.startX, currentPosition.startY]]
        }
    }
    isPointInShape(penShape: PenShape, px: number, py: number,): boolean {

    if(penShape.lineArray.length < 2) return false;

    for (let i = 0; i < penShape.lineArray.length - 1; i++) {
        const p1 = penShape.lineArray[i];
        const p2 = penShape.lineArray[i + 1];
        if(p1 && p2){
            return this.isPointInLine(p1[0], p2[0], p1[1], p2[1], px, py, 10);
        }
    }
    return false;
}
}