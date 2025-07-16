import type { PenArrayShape, PenShape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../shapes/baseClass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type {
  BehaviorContext,
  IInteractionBehavior,
} from "../InteractionBehaviour/baseclass";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
import { AddShapeCommand } from "../UndoAndRedoCmd/ShapeCommand";
import type { CanvasManager } from "@/manager/CanvasManager";

export class PenBehavior implements IInteractionBehavior {
  private currentPath: PenArrayShape[] = [];
  private clicked = false;
  private dragged = false;
  constructor(private shapeRenders: IShapeRenders<PenShape>) {}
  onMouseDown({ x, y }: BehaviorContext): void {
    this.clicked = true;
    this.currentPath = [[x, y]];
  }
  onMouseMove({ x, y, manager }: BehaviorContext): void {
    const { drawCanvas } = manager;
    if (this.clicked && this.shapeRenders) {
      this.currentPath.push([x, y]);
      drawCanvas();
      this.dragged = true;
    }
  }
  onMouseUp({ manager, executeCanvasCommnad }: BehaviorContext): void {
    const { config, drawCanvas } = manager;
    this.clicked = false;
    if (this.dragged && this.shapeRenders && this.currentPath.length > 1) {
      const newShape: PenShape = {
        type: TOOLS_NAME.PEN,
        lineArray: [...this.currentPath],
        config: config,
      };
      executeCanvasCommnad(new AddShapeCommand(manager, newShape));
      drawCanvas();
      this.currentPath = [];
    }
    this.dragged = false;
  }
  renderShapes(manager: CanvasManager, shape: PenShape): void {
    const { roughCanvas, offScreenCanvasctx } = manager;
    if (this.shapeRenders) {
      this.shapeRenders.render(
        {
          type: TOOLS_NAME.PEN,
          lineArray: shape.lineArray,
          config: shape.config,
        },
        roughCanvas,
        offScreenCanvasctx,
      );
    }
  }

  previewShape(
    manager: CanvasManager,
    config: TextOptionsPlusGeometricOptions,
  ): void {
    const { roughCanvas, offScreenCanvasctx } = manager;
    if (this.shapeRenders && this.dragged && this.currentPath.length > 1) {
      this.shapeRenders.render(
        {
          type: TOOLS_NAME.PEN,
          lineArray: this.currentPath,
          config: config,
        },
        roughCanvas,
        offScreenCanvasctx,
      );
    }
  }
  getShapeRenderer(): IShapeRenders<PenShape> {
    return this.shapeRenders;
  }
}
