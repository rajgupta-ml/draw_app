import type {
  currentPositionType,
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
  private sessionId : string | null = null;
  constructor(private shapeRenders: IShapeRenders<T>) {}
  onMouseDown(context: BehaviorContext): void {
    const {x,y, collaborativeManager, manager} = context
    this.clicked = true;
    this.currentPosition.startX = x;
    this.currentPosition.startY = y;

    this.currentPosition.endX = x;
    this.currentPosition.endY = y;
    this.sessionId = collaborativeManager.createSession(manager.selectedTool, this.currentPosition, manager.config)
    

  }
  onMouseMove( context : BehaviorContext): void {
    const {manager, x,y, collaborativeManager} = context
    const { drawCanvas } = manager;
    if (this.clicked && this.shapeRenders) {
      this.currentPosition.endX = x;
      this.currentPosition.endY = y;
      collaborativeManager.updateSession(this.sessionId!, this.currentPosition, manager.config)
      // drawCanvas();
      this.dragged = true;
    }
  }
  onMouseUp(context: BehaviorContext): void {
    const {manager, executeCanvasCommnad, collaborativeManager} = context
    // const { drawCanvas } = manager;
    this.clicked = false;
    if (this.dragged && this.shapeRenders) {
      const newShape = this.shapeRenders.createShape(this.currentPosition);
      const updatedConfig = {...manager.config};
      const newShapeWithConfig = { ...newShape,  config : updatedConfig };
      // executeCanvasCommnad(new AddShapeCommand(manager, newShapeWithConfig));
      collaborativeManager.endSession(this.sessionId!, newShapeWithConfig)
      this.sessionId = null      
      // drawCanvas(); 
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

  getPosition() : currentPositionType {
    return (this.currentPosition as currentPositionType)
  }

  setPosition(position : currentPositionType) {
    this.currentPosition = position
  }
  getClicked() : boolean {
    return this.clicked
  }

  setClicked(clicked : boolean) {
    this.clicked = clicked
  } 
  getDragged() : boolean {
    return this.dragged 
  }

  setDragged(dragged : boolean) {
    this.dragged = dragged
  }  
}
