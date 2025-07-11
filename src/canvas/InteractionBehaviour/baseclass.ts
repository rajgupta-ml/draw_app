import type { PenShape, Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";


export interface BehaviorContext {
    x: number;
    y: number;
    shapes: Shape[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    roughCanvas: RoughCanvas;
    addShape: (shape: Shape) => void;
    requestRedraw: (isScrolling? : boolean) => void;
  }
export interface IInteractionBehavior {
    onMouseDown(context: BehaviorContext): void;
    onMouseMove(context: BehaviorContext): void;
    onMouseUp(context: BehaviorContext): void;
    /** A method to render temporary graphics, like a preview or selection box. */
    renderShapes(context: Pick<BehaviorContext, "roughCanvas">, shape? : Shape): void;
    previewShape(context: Pick<BehaviorContext, "roughCanvas">): void;

  }