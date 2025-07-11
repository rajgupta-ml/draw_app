import type { Shape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RoughCanvas } from "roughjs/bin/canvas";
import { InteractionBehaviourList } from "@/canvas/shapes/ShapeClassList";
import type { BehaviorContext, IInteractionBehavior } from "@/canvas/InteractionBehaviour/baseclass";

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private interactionBehaviours : typeof InteractionBehaviourList = InteractionBehaviourList;
  private roughCanvas: RoughCanvas;
  private ctx: CanvasRenderingContext2D;
  private scrollPositionX: number = 0;
  private scrollPositionY: number = 0;
  private shapes: Shape[] = [];
  private selectedTool: TOOLS_NAME;
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
    this.scrollPositionX += e.deltaX
    this.scrollPositionY += e.deltaY
    this.drawCanvas({ isScrolling: true });
  };

  private handleMouseDown = (e: MouseEvent) => {
    this.interactionBehaviours.get(this.selectedTool)!.onMouseDown(this.createBehaviorContext(e))
    
  };
  private handleMouseMove = (e: MouseEvent) => {
    this.interactionBehaviours.get(this.selectedTool)!.onMouseMove(this.createBehaviorContext(e));
    // const { x, y } = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY);
    // // Selection Logic which should seprated into anothor behviour
    // if(this.selectedTool === TOOLS_NAME.MOUSE){
    //   const shapeUnderMouse = this.shapes.find((shape) => {
    //     const shapeRenders = this.drawingBehaviorList.get(shape.type)?.getShapeRenders();
    //     if(shapeRenders){
    //       return shapeRenders.isPointInShape(shape, x,y) ? shape : null;
    //     }

    //     return null;
    //   })


    //   this.selectedShape = shapeUnderMouse || null;
    //   if (this.selectedShape) {
    //     this.canvas.style.cursor = "crosshair";
    //   } else {
    //     this.canvas.style.cursor = "default";
    //   }
    // }
  };
  private handleMouseUp = (e: MouseEvent) => {
    this.interactionBehaviours.get(this.selectedTool)!.onMouseUp(this.createBehaviorContext(e));
    console.log(this.shapes);
  };

  

  // Draw and render on canvas method
  drawCanvas = ({ isScrolling }: { isScrolling: boolean }) => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-this.scrollPositionX, -this.scrollPositionY);


    // Rendering the Shapes from history
    this.shapes.map((shape) => {
     this.interactionBehaviours.get(shape.type)!.renderShapes({roughCanvas : this.roughCanvas},shape); 
    });

    // Drawing the shape preview
    if (!isScrolling) {
      this.interactionBehaviours.get(this.selectedTool)!.previewShape({roughCanvas : this.roughCanvas});
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

   // Helper
  private getCoordinateAdjustedByScroll = (
    coorX: number,
    coorY: number,
  ): { x: number; y: number } => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = coorX - canvasRect.left + this.scrollPositionX;
    const y = coorY - canvasRect.top + this.scrollPositionY;

    return { x, y };
  };

  private createBehaviorContext(e: MouseEvent): BehaviorContext {
    const {x, y} = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY);
    return {
      x, y,
      shapes: this.shapes,
      canvas: this.canvas,
      ctx: this.ctx,
      roughCanvas: this.roughCanvas,
      addShape: (shape) => this.shapes.push(shape),
      requestRedraw: (isScrolling = false) => this.drawCanvas({isScrolling}),
    };
  }

}
