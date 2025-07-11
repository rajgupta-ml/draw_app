import type { currentPositionType, Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";

// export interface IShapeRenders<T extends Shape> {
//   createShape: (currentPosition: currentPositionType) => T;
//   render: (existingShape: T, canvas: RoughCanvas) => void;
// }


export abstract class IShapeRenders<T extends Shape > {

  abstract createShape(currentPosition: currentPositionType) : T;
  abstract render (existingShape: T, canvas: RoughCanvas) : void;
  abstract isPointInShape(shape : T, px : number, py : number) : boolean

  protected isPointInLine(x1 : number, x2 : number, y1 : number, y2 : number, px : number, py : number, TOLERANCE: number = 10) : boolean {
    const AB = [(x2 - x1), (y2 - y1)] 

    const AP = [px - x1, py - y1];  
    const AB2 = Math.pow(AB[0]!,2) + Math.pow(AB[1]!,2);
    const t = ((AP[0]! * AB[0]!) + (AP[1]! * AB[1]!)) / AB2;
    const clapping = Math.max(0, Math.min(1, t));

    const cX = x1 + clapping * (x2 -x1)
    const cY = y1 + clapping * (y2 - y1);

    //Eculidean distance

    const distance = Math.sqrt(Math.pow(px - cX, 2) + Math.pow(py - cY, 2));
    if(distance  < TOLERANCE) {
        return true;
    }   
    return false;
  }
}
