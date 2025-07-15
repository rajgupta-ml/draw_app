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
import { shapeConfig } from "@/constants/canvasConstant";
import type { Options } from "roughjs/bin/core";
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
  onMouseMove({ x, y, requestRedraw }: BehaviorContext): void {
    if (this.clicked && this.shapeRenders) {
      this.currentPosition.endX = x;
      this.currentPosition.endY = y;
      requestRedraw();
      this.dragged = true;
    }
  }
  onMouseUp({ requestRedraw, addShape, config }: BehaviorContext): void {
    this.clicked = false;
    if (this.dragged && this.shapeRenders) {
      const newShape = this.shapeRenders.createShape(this.currentPosition);
      const newShapeWithConfig = {...newShape, config}
      if (newShape) {
        addShape({ ...newShapeWithConfig, id: crypto.randomUUID() });
      }
      requestRedraw();
    }
    this.dragged = false;
  }
  renderShapes(
    { roughCanvas, ctx }: Pick<BehaviorContext, "roughCanvas" | "ctx">,
    shape: T,
  ): void {
    if (this.shapeRenders) {
      this.shapeRenders.render(shape, roughCanvas, ctx);
    }
  }
  previewShape({ roughCanvas, ctx}: Pick<BehaviorContext, "roughCanvas" | "ctx">, config : Options): void {
    if (this.shapeRenders && this.dragged) {
      const shape = this.shapeRenders.createShape(this.currentPosition);
      const newShapeWithConfig = {...shape, config}
      this.shapeRenders.render(newShapeWithConfig, roughCanvas, ctx);
    }
  }
  getShapeRenderer(): IShapeRenders<T> {
    return this.shapeRenders;
  }
}
