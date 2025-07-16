import type { Shape } from "@/types/canvasTypes";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { IShapeRenders } from "../shapes/baseClass";
import type { Options } from "roughjs/bin/core";
import type { ICommand } from "../UndoAndRedoCmd/baseClass";
import type { CanvasManager } from "@/manager/CanvasManager";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

export interface BehaviorContext {
  x: number;
  y: number;
  rawX : number;
  rawY : number;
  manager : CanvasManager
  executeCanvasCommnad : (commnad : ICommand) => void
  isPointInShape: (shape: Shape, px: number, py: number) => Boolean;
  setScrollPositionX: (x : number) => void
  setScrollPositionY: (y : number) => void

}
export interface IInteractionBehavior {
  onMouseDown(context: BehaviorContext): void;
  onMouseMove(context: BehaviorContext): void;
  onMouseUp(context: BehaviorContext): void;
  /** A method to render temporary graphics, like a preview or selection box. */
  renderShapes?(
    manager: CanvasManager,
    shape: Shape,
  ): void;
  previewShape?(manager: CanvasManager, config: TextOptionsPlusGeometricOptions): void;
  getShapeRenderer?(): IShapeRenders<Shape>;
}
