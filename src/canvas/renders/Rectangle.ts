import type { RectShape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { currentPositionType } from "@/manager/CanvasManager";
import { shapeConfig } from "@/constants/canvasConstant";
import { TOOLS_NAME } from "@/types/toolsTypes";

export class Rectangle implements IShapeRenders<RectShape> {

  
    render =(existingShape : RectShape, canvas : RoughCanvas) => {
        canvas.rectangle(existingShape.x, existingShape.y, existingShape.w, existingShape.h, shapeConfig)
    }

    createShape = (currentPosition : currentPositionType ) : RectShape => {
         const x =  Math.min(currentPosition.startX, currentPosition.endX);
         const y =  Math.min(currentPosition.startY, currentPosition.endY);
         const w =  Math.abs(currentPosition.startX - currentPosition.endX);
         const h =  Math.abs(currentPosition.startY - currentPosition.endY);
        return {type : TOOLS_NAME.RECT,x,y,w,h}
    }
}
