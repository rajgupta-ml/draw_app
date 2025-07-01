import type { Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { IShapeRenders } from "../baseClass";

// export interface  DrawingBehavior {
//     onMouseDown(x : number, y : number ):void,
//     onMouseUp(): Shape | null,
//     onMouseMove(x : number, y : number ):void,
//     renderPreview (canvas : RoughCanvas) : void

// }

export abstract class DrawingBehavior<T extends Shape> { 
    protected shapeRenders : IShapeRenders<T> | null = null;
    getShapeRenders = () : IShapeRenders<T> | null => {
        if(this.shapeRenders) {
            return this.shapeRenders
        }
        return null
    }

    abstract onMouseDown(x: number, y: number): void; 
    abstract onMouseUp() : T | null;
    abstract onMouseMove(x:number, y:number) : void
    abstract renderPreview (canvas : RoughCanvas) : void
}