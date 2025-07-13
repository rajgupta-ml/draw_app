import type { PenArrayShape, PenShape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../shapes/baseClass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type {
  BehaviorContext,
  IInteractionBehavior,
} from "../InteractionBehaviour/baseclass";
import { shapeConfig } from "@/constants/canvasConstant";

export class PenBehavior implements IInteractionBehavior {
  private currentPath: PenArrayShape[] = [];
  private clicked = false;
  private dragged = false;
  constructor(private shapeRenders: IShapeRenders<PenShape>) {}
  onMouseDown({ x, y }: BehaviorContext): void {
    this.clicked = true;
    this.currentPath = [[x, y]];
  }
  onMouseMove({ x, y, requestRedraw }: BehaviorContext): void {
    if (this.clicked && this.shapeRenders) {
      this.currentPath.push([x, y]);
      requestRedraw();
      this.dragged = true;
    }
  }
  onMouseUp({ requestRedraw, addShape }: BehaviorContext): void {
    this.clicked = false;
    if (this.dragged && this.shapeRenders && this.currentPath.length > 1) {
      const newShape: PenShape = {
        type: TOOLS_NAME.PEN,
        lineArray: [...this.currentPath],
      };
      if (newShape) {
        addShape({ ...newShape, id: crypto.randomUUID(), config : shapeConfig });
      }
      requestRedraw();
      this.currentPath = [];
    }
    this.dragged = false;
  }
  renderShapes(
    { roughCanvas,ctx }: Pick<BehaviorContext, "roughCanvas" | "ctx">,
    shape: PenShape,
  ): void {
    if (this.shapeRenders) {
      this.shapeRenders.render(
        { type: TOOLS_NAME.PEN, lineArray: shape.lineArray, config : shape.config  },
        roughCanvas,
        ctx
      );
    }
  }

  previewShape({ roughCanvas, ctx }: Pick<BehaviorContext, "roughCanvas" | "ctx">): void {
    if (this.shapeRenders && this.dragged && this.currentPath.length > 1) {
      this.shapeRenders.render(
        { type: TOOLS_NAME.PEN, lineArray: this.currentPath, config : shapeConfig },
        roughCanvas,
        ctx
      );
    }
  }
  getShapeRenderer(): IShapeRenders<PenShape> {
    return this.shapeRenders;
  }
}
