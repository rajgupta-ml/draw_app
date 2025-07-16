import type { currentPositionType, TextShape } from "@/types/canvasTypes";
import { IShapeRenders } from "./baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { shapeConfig } from "@/constants/canvasConstant";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

export class Text extends IShapeRenders<TextShape>{
    createShape(currentPosition: currentPositionType) : TextShape {
        const config : TextOptionsPlusGeometricOptions = {
            fontFamily : "Arial",
            fontSize : "16px",
            stroke : shapeConfig.stroke,
            textAlignment : "left",
        } 
        const newShape : TextShape = {
            id : crypto.randomUUID(),
            type : TOOLS_NAME.TEXT,
            text : "",
            x : currentPosition.startX,
            y : currentPosition.startY,
            w : 0,
            config 
        }
        return newShape
    }
    render(existingShape: TextShape, canvas: RoughCanvas, ctx: CanvasRenderingContext2D): void {
        ctx.font = `${existingShape.config.fontSize}px ${existingShape.config.fontFamily}`
        ctx.fillStyle = existingShape.config.stroke!
        ctx.textBaseline = "top"; 
        ctx.fillText(existingShape.text, existingShape.x , existingShape.y);
    }
    isPointInShape(shape : TextShape, px : number, py : number) {
        const fontSize = parseInt(shape.config.fontSize.replace('px', ''));       
      
        const left = shape.x ;
        const top = shape.y;
        const right = shape.x + (shape.w );
        const bottom = shape.y + fontSize; 
        return px >= left && px <= right && py >= top && py <= bottom;
      }

}