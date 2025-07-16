import type {
  DiamondShape,
  EclipseShape,
  LineShape,
  RectShape,
  RightArrowShape,
} from "@/types/canvasTypes";
import type { IShapeRenders } from "../shapes/baseClass";
import type {
  BehaviorContext,
  IInteractionBehavior,
} from "../InteractionBehaviour/baseclass";
import type { Options } from "roughjs/bin/core";
import { AddShapeCommand } from "../UndoAndRedoCmd/ShapeCommand";
import type { CanvasManager } from "@/manager/CanvasManager";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
type GeometricShape =
  | RectShape
  | EclipseShape
  | LineShape
  | RightArrowShape
  | DiamondShape;

export class GeometricBehaviour<T extends GeometricShape>
  implements IInteractionBehavior
{
  private currentPosition = { startX: 0, startY: 0, endX: 0, endY: 0 };
  private clicked = false;
  private dragged = false;
  constructor(private shapeRenders: IShapeRenders<T>) {}
  onMouseDown({ x, y }: BehaviorContext): void {
    this.clicked = true;
    this.currentPosition.startX = x;
    this.currentPosition.startY = y;

    this.currentPosition.endX = x;
    this.currentPosition.endY = y;
  }
  onMouseMove({ x, y, manager }: BehaviorContext): void {
    const { drawCanvas } = manager;
    if (this.clicked && this.shapeRenders) {
      this.currentPosition.endX = x;
      this.currentPosition.endY = y;
      drawCanvas();
      this.dragged = true;
    }
  }
  onMouseUp({ executeCanvasCommnad, manager }: BehaviorContext): void {
    const { drawCanvas } = manager;
    this.clicked = false;
    if (this.dragged && this.shapeRenders) {
      const newShape = this.shapeRenders.createShape(this.currentPosition);
      const updatedConfig = {...manager.config};
      console.log("UpdatedConfig" , updatedConfig)
      const newShapeWithConfig = { ...newShape,  config : updatedConfig };
      executeCanvasCommnad(new AddShapeCommand(manager, newShapeWithConfig));
      drawCanvas();
    }
    this.dragged = false;
  }
  renderShapes(manager: CanvasManager, shape: T): void {
    const { roughCanvas, offScreenCanvasctx } = manager;
    if (this.shapeRenders) {
      this.shapeRenders.render(shape, roughCanvas, offScreenCanvasctx);
    }
  }
  previewShape(manager: CanvasManager, config: TextOptionsPlusGeometricOptions): void {
    const { roughCanvas, offScreenCanvasctx } = manager;

    if (this.shapeRenders && this.dragged) {
      const shape = this.shapeRenders.createShape(this.currentPosition);
      const newShapeWithConfig = { ...shape, config };
      this.shapeRenders.render(
        newShapeWithConfig,
        roughCanvas,
        offScreenCanvasctx,
      );
    }
  }
  getShapeRenderer(): IShapeRenders<T> {
    return this.shapeRenders;
  }
}
