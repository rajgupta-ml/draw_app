import type { LineShape } from "@/types/canvasTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { IShapeRenders } from "../baseClass";
import type { currentPositionType } from "@/manager/CanvasManager";

export class Line implements IShapeRenders<LineShape> {

    
    render =(existingShape : LineShape, canvas : RoughCanvas) => {
        canvas.line(existingShape.x1, existingShape.y1, existingShape.x2, existingShape.y2, shapeConfig)
    }

    createShape = (currentPosition : currentPositionType ) : LineShape => {
        const x1 = currentPosition.startX;
        const y1 = currentPosition.startY;
        const x2 = currentPosition.endX;
        const y2 = currentPosition.endY;

        return {type : TOOLS_NAME.LINE, x1, y1, x2, y2};
            
    }

   
}