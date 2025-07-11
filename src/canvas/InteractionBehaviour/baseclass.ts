import type { Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { IShapeRenders } from "../shapes/baseClass";

export interface BehaviorContext {
  x: number;
  y: number;
  shapes: Shape[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  roughCanvas: RoughCanvas;
  addShape: (shape: Shape) => void;
  requestRedraw: (isScrolling?: boolean) => void;
  isPointInShape: (shape: Shape, px: number, py: number) => Boolean;
}
export interface IInteractionBehavior {
  onMouseDown(context: BehaviorContext): void;
  onMouseMove(context: BehaviorContext): void;
  onMouseUp(context: BehaviorContext): void;
  /** A method to render temporary graphics, like a preview or selection box. */
  renderShapes(
    context: Pick<BehaviorContext, "roughCanvas">,
    shape: Shape,
  ): void;
  previewShape(context: Pick<BehaviorContext, "roughCanvas">): void;
  getShapeRenderer?(): IShapeRenders<Shape>;
}
