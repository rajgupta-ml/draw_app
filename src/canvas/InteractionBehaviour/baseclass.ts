import type { currentPositionType, Shape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../shapes/baseClass";
import type { ICommand } from "../UndoAndRedoCmd/baseClass";
import type { CanvasManager } from "@/manager/CanvasManager";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
import type { CollaborativeBehaviorManager } from "@/manager/CollaborativeManager";

export interface BehaviorContext {
  calledFromCollaborationManager : boolean;
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  manager: CanvasManager;
  collaborativeManager : CollaborativeBehaviorManager
  executeCanvasCommnad: (commnad: ICommand) => void;
  isPointInShape: (shape: Shape, px: number, py: number) => boolean;
  setScrollPositionX: (x: number) => void;
  setScrollPositionY: (y: number) => void;
}
export interface IInteractionBehavior {
  onMouseDown(context: BehaviorContext): void;
  onMouseMove(context: BehaviorContext): void;
  onMouseUp(context: BehaviorContext): void;
  renderShapes?(manager: CanvasManager, shape: Shape): void;
  previewShape?(
    manager: CanvasManager,
    config: TextOptionsPlusGeometricOptions,
  ): void;
  getShapeRenderer?(): IShapeRenders<Shape>;
  createNewShape?(manager : CanvasManager): Shape,
  removeShape?(executeCanvasCommnad : (command : ICommand)=> void, manager : CanvasManager ) : void,
  updateState(state : unknown): void
  getState() : unknown
  resetState(): void
}
