import type { RoughCanvas } from "roughjs/bin/canvas";
import type { IShapeRenders } from "../baseClass";
import type { PenShape } from "@/types/canvasTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { currentPositionType } from "@/manager/CanvasManager";

export class Pen implements IShapeRenders<PenShape> {
    render(existingShape: PenShape, canvas: RoughCanvas): void {
        console.log(existingShape);
        canvas.linearPath(existingShape.lineArray, shapeConfig)
    }

    createShape(currentPosition: currentPositionType): PenShape {
        return {
            type : TOOLS_NAME.PEN,
            lineArray : [[currentPosition.startX, currentPosition.startY]]
        }
    }
}