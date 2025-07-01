import type { Shape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RoughCanvas } from "roughjs/bin/canvas";
import { DrawingBehaviorList } from "@/canvas/renders/ShapeClassList";
import type { DrawingBehavior } from "@/canvas/drawingBehaviour/baseClass";
export type currentPositionType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private drawingBehaviorList : typeof DrawingBehaviorList = DrawingBehaviorList;
  private drawingBehavior : DrawingBehavior<Shape> | null = null;
  private roughCanvas: RoughCanvas;
  private ctx: CanvasRenderingContext2D;
  private clicked: boolean = false;
  private scrollPositionX: number = 0;
  private scrollPositionY: number = 0;
  private shapes: Shape[] = [];
  private selectedTool: TOOLS_NAME;
  private dragged = false;
   constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.roughCanvas = new RoughCanvas(this.canvas);
    this.selectedTool = TOOLS_NAME.RECT, 
    this.ctx = ctx
  }
  // Add And Remove Event Listner
  addEventListeners = () => {

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("wheel", this.handleScroll);
  };

  destroyEventListeners = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("wheel", this.handleScroll);
  };
  
  private handleScroll = (e: WheelEvent) => {
    e.preventDefault();
    ((this.scrollPositionX += e.deltaX),
      (this.scrollPositionY += e.deltaY),
      this.drawCanvas({ isScrolling: true }));
  };

  private handleMouseDown = (e: MouseEvent) => {
    this.clicked = true;
    const { x, y } = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY);
    this.drawingBehavior = this.drawingBehaviorList.get(this.selectedTool) || null;
    this.drawingBehavior?.onMouseDown(x,y);
  };
  private handleMouseMove = (e: MouseEvent) => {
    if (this.clicked && this.drawingBehavior) {
      const { x, y } = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY);
      this.drawingBehavior?.onMouseMove(x,y);
      this.drawCanvas({isScrolling : false});
      this.dragged = true;
    }
  };
  private handleMouseUp = (e: MouseEvent) => {
    this.clicked = false;
    
    if (this.dragged && this.drawingBehavior) {
      const newShape = this.drawingBehavior.onMouseUp();
      if (newShape) {
        this.shapes.push(newShape);
      }
      this.drawCanvas({ isScrolling: false });
    }

    this.dragged = false;
    this.drawingBehavior = null;
  };

  private getCoordinateAdjustedByScroll = (
    coorX: number,
    coorY: number,
  ): { x: number; y: number } => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = coorX - canvasRect.left + this.scrollPositionX;
    const y = coorY - canvasRect.top + this.scrollPositionY;

    return { x, y };
  };


  drawCanvas = ({ isScrolling }: { isScrolling: boolean }) => {
    const currentToolStrategy = this.drawingBehavior
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-this.scrollPositionX, -this.scrollPositionY);

    // Rendering the Shapes from history
    this.shapes.map((shape) => {
      const shapeRenders = this.drawingBehaviorList.get(shape.type)?.getShapeRenders();
      if(shapeRenders){
        shapeRenders.render(shape, this.roughCanvas)
      }
        
    });

    // Drawing the shape preview
    if (!isScrolling && this.dragged && currentToolStrategy) {
      this.drawingBehavior?.renderPreview(this.roughCanvas);
    }
    this.ctx.restore();
  };

  // Setter and Getter Methods
  setTool = (tool: TOOLS_NAME) => {
    this.selectedTool = tool;
    console.log(this.selectedTool);
  };

  getTool = (): TOOLS_NAME => {
    return this.selectedTool;
  };
}
