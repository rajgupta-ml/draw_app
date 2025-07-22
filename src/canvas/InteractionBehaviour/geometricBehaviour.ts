import type {
  currentPositionType,
  DiamondShape,
  EclipseShape,
  LineShape,
  RectShape,
  RightArrowShape,
  Shape,
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
    const {x,y, collaborativeManager, rawX, rawY, calledFromCollaborationManager} = context
    this.clicked = true;
    this.currentPosition.startX = x;
    this.currentPosition.startY = y;

    this.currentPosition.endX = x;
    this.currentPosition.endY = y;
    if(!calledFromCollaborationManager){
      this.sessionId = collaborativeManager.createSession(this, {x,y,rawX,rawY});

    }
  }


  onMouseMove( context : BehaviorContext): void {
    const {x,y, collaborativeManager, manager, rawX, rawY, calledFromCollaborationManager} = context
    
    const { drawCanvas } = manager;
    this.dragged = true;
    console.log({shapeRenders : this.shapeRenders})
    if (this.clicked && this.shapeRenders) {
      this.currentPosition.endX = x;
      this.currentPosition.endY = y;
      if(this.sessionId && !calledFromCollaborationManager){
        collaborativeManager.updateSession(this.sessionId, this, {x,y,rawX,rawY})
      }
      drawCanvas();
    }
  }
  onMouseUp(context: BehaviorContext): void {
    const {x,y, collaborativeManager, executeCanvasCommnad, manager, rawX, rawY, calledFromCollaborationManager} = context
    const { drawCanvas } = manager;
    this.clicked = false;
    if (this.dragged && this.shapeRenders) {
      const newShapeWithConfig = this.createNewShape(manager)
      if(this.sessionId && !calledFromCollaborationManager) {
        collaborativeManager.endSession(this.sessionId, this, {x,y,rawX,rawY})
      }
      executeCanvasCommnad(new AddShapeCommand(manager, newShapeWithConfig));
      this.sessionId = null      
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

  updateState(state: unknown): void {
      if(isGeometricBehaviorState(state)){
        this.clicked = state.clicked,
        this.currentPosition = state.currentPosition
        this.dragged = state.dragged
      }
  }  

  getState() : unknown {
    return {
      clicked :this.clicked,
      currentPosition : this.currentPosition,
      dragged : this.dragged
    }
  }

  resetState(): void {
    this.clicked = false,
    this.dragged = false,
    this.currentPosition = {startX : 0, startY : 0, endX : 0, endY : 0}
  }

  createNewShape(manager : CanvasManager) : Shape {
    const newShape = this.shapeRenders.createShape(this.currentPosition);
    const updatedConfig = {...manager.config};
    const newShapeWithConfig = { ...newShape,  config : updatedConfig };
    return newShapeWithConfig
  }

}


interface IGeometricBehaviorState {
  currentPosition: currentPositionType;
  clicked: boolean;
  dragged: boolean;
}

// Create a type guard function to check if an unknown object matches the state shape
function isGeometricBehaviorState(state: unknown): state is IGeometricBehaviorState {
    const s = state as IGeometricBehaviorState;
    return (
        s &&
        typeof s === 'object' &&
        typeof s.clicked === 'boolean' &&
        typeof s.dragged === 'boolean' &&
        s.currentPosition &&
        typeof s.currentPosition.startX === 'number' &&
        typeof s.currentPosition.startY === 'number' &&
        typeof s.currentPosition.endX === 'number' &&
        typeof s.currentPosition.endY === 'number'
    );
}
