import type { DiamondShape, EclipseShape, LineShape, RectShape, RightArrowShape, Shape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../baseClass";
import { DrawingBehavior } from "./baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";

type GeometricShape = RectShape | EclipseShape | LineShape | RightArrowShape | DiamondShape

export class GeometricBehaviour<T extends GeometricShape> extends DrawingBehavior<T> {

    private currentPosition = {startX : 0, startY : 0, endX : 0, endY : 0}
    // private shapeRenders : IShapeRenders<Shape>
    constructor(shapeRenders : IShapeRenders<T>){
        super();
        this.shapeRenders =shapeRenders
    }
    onMouseDown(x: number, y: number) : void{
        this.currentPosition.startX = x;
        this.currentPosition.startY = y
    };

    onMouseUp() : T | null{
        if(this.shapeRenders){
            return this.shapeRenders.createShape(this.currentPosition)
        }
        return null;
    }

    onMouseMove(x: number, y: number): void {
        this.currentPosition.endX = x;
        this.currentPosition.endY = y;
    }

    renderPreview(canvas: RoughCanvas): void {
        if(this.shapeRenders){
            const shape = this.shapeRenders.createShape(this.currentPosition);
            this.shapeRenders.render(shape, canvas);
        }
    }

    getShapeRender () : IShapeRenders<T>  | null{
        if(this.shapeRenders){
            return this.shapeRenders;
        }
        return null
    }
}