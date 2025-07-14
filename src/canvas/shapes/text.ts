import type { currentPositionType, TextShape } from "@/types/canvasTypes";
import { IShapeRenders } from "./baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { shapeConfig } from "@/constants/canvasConstant";

export class Text extends IShapeRenders<TextShape>{
    createShape(currentPosition: currentPositionType) : TextShape {
        const newShape : TextShape = {
            id : crypto.randomUUID(),
            type : TOOLS_NAME.TEXT,
            text : "",
            x : currentPosition.startX,
            y : currentPosition.startY,
            w : 0,
            config : {
                font_family : "Arial",
                font_size : "16px",
                font_weight : "400",
                stroke : shapeConfig.stroke,
            }
        }
        return newShape
    }
    render(existingShape: TextShape, canvas: RoughCanvas, ctx: CanvasRenderingContext2D): void {
        ctx.font = "16px Arial";
        ctx.font = `${existingShape.config.font_size} ${existingShape.config.font_family}`
        ctx.fillStyle = existingShape.config.stroke
        ctx.textBaseline = "top"; 
        ctx.fillText(existingShape.text, existingShape.x , existingShape.y);
    }
    isPointInShape(shape : TextShape, px : number, py : number) {
        const fontSize = parseInt(shape.config.font_size.replace('px', ''));       
      
        const left = shape.x ;
        const top = shape.y;
        const right = shape.x + (shape.w );
        const bottom = shape.y + fontSize; 
        return px >= left && px <= right && py >= top && py <= bottom;
      }

}