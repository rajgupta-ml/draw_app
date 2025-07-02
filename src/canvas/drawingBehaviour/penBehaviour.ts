import type { PenArrayShape, PenShape, Shape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../baseClass";
import { DrawingBehavior } from "./baseClass";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { TOOLS_NAME } from "@/types/toolsTypes";

export class PenBehavior extends DrawingBehavior<PenShape> {
    private currentPath : PenArrayShape[] = [] 
    constructor(shapeRenders : IShapeRenders<PenShape>){
        super();
        this.shapeRenders = shapeRenders
    }
    onMouseDown(x: number, y: number) : void{
       this.currentPath = [[x,y]];
    };

    onMouseMove(x: number, y: number): void {
        {console.log({x,y})}
        this.currentPath.push([x,y])

    }
    onMouseUp(): PenShape | null {
        if (this.currentPath.length > 1) {
          const shape : PenShape = { type: TOOLS_NAME.PEN, lineArray: [...this.currentPath] };
          this.currentPath = [];
          return shape;
        }
        return null;
      }


    renderPreview(canvas: RoughCanvas): void {
        if (this.currentPath.length > 1 && this.shapeRenders) {
            this.shapeRenders.render(
              { type: TOOLS_NAME.PEN, lineArray: this.currentPath },
              canvas
            );
          }
    }

}