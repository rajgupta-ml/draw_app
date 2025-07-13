import type { currentPositionType, TextShape } from "@/types/canvasTypes";
import { IShapeRenders } from "./baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";

export class Text extends IShapeRenders<TextShape>{
    createShape(currentPosition: currentPositionType) : TextShape {
        const newShape : TextShape = {
            id : crypto.randomUUID(),
            type : TOOLS_NAME.TEXT,
            text : "",
            x : currentPosition.startX,
            y : currentPosition.startY,
            w : 0,
            font_family : "Arial",
            font_size : "16px",
            font_weight : "400",
            color : "#ffffff",
        }
        return newShape
    }
    render(existingShape: TextShape, canvas: RoughCanvas, ctx: CanvasRenderingContext2D): void {
        ctx.font = "16px Arial";
        const fontSize = parseInt(existingShape.font_size.replace('px', ''));        const padding = 10;
        ctx.font = `${existingShape.font_size} ${existingShape.font_family}`
        ctx.fillStyle = existingShape.color
        ctx.textBaseline = "top"; 
        ctx.fillText(existingShape.text, existingShape.x , existingShape.y);
    }
    isPointInShape(shape : TextShape, px : number, py : number) {
        const fontSize = parseInt(shape.font_size.replace('px', ''));        const padding = 10;
      
        // Calculate the text's actual top coordinate from its baseline 'y'
        const textTop = shape.y - fontSize;
      
        // Define the bounding box by applying padding to all four sides
        const left = shape.x - shape.w;
        const top = textTop;
        const right = shape.x + shape.w;
        const bottom = shape.y + fontSize; // textTop + fontSize + padding
      
        // Return true if the point is within the symmetrical bounding box
        return px >= left && px <= right && py >= top && py <= bottom;
      }

}