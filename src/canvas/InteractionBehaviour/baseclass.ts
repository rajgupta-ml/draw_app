import type { Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { IShapeRenders } from "../shapes/baseClass";
import type { Options } from "roughjs/bin/core";

export interface BehaviorContext {
  x: number;
  y: number;
  rawX : number;
  rawY : number;
  config : Options;
  shapes: Shape[];
  inputArea: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  roughCanvas: RoughCanvas;
  addShape: (shape: Shape) => void;
  removeShape : (id : string) => void;
  addRedoShape : (shape: Shape) => void;
  requestRedraw: (isScrolling?: boolean) => void;
  isPointInShape: (shape: Shape, px: number, py: number) => Boolean;
  getScrollPositionX: () => number
  getScrollPositionY: () => number
  setScrollPositionX: (x : number) => void
  setScrollPositionY: (y : number) => void

}
export interface IInteractionBehavior {
  onMouseDown(context: BehaviorContext): void;
  onMouseMove(context: BehaviorContext): void;
  onMouseUp(context: BehaviorContext): void;
  /** A method to render temporary graphics, like a preview or selection box. */
  renderShapes?(
    context: Pick<BehaviorContext, "roughCanvas" | "ctx">,
    shape: Shape,
  ): void;
  previewShape?(context: Pick<BehaviorContext, "roughCanvas" | "ctx">, config: Options): void;
  getShapeRenderer?(): IShapeRenders<Shape>;
}
