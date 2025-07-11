import type { Shape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RoughCanvas } from "roughjs/bin/canvas";
import { InteractionBehaviourList } from "@/canvas/shapes/ShapeClassList";
import type {
  BehaviorContext,
} from "@/canvas/InteractionBehaviour/baseclass";
import type { IShapeRenders } from "@/canvas/shapes/baseClass";

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private interactionBehaviours: typeof InteractionBehaviourList = InteractionBehaviourList;
  private roughCanvas: RoughCanvas;
  private ctx: CanvasRenderingContext2D;
  private scrollPositionX: number = 0;
  private scrollPositionY: number = 0;
  private shapes: Shape[] = [];
  private redoShape: Shape[] = [];
  private selectedTool: TOOLS_NAME;
  private scale: number = 1; 
  private maxScrollX: number = 0; 
  private maxScrollY: number = 0;
  private minScale: number = 0.1; 
  private maxScale: number = 10; 
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.roughCanvas = new RoughCanvas(this.canvas);
    ((this.selectedTool = TOOLS_NAME.RECT), (this.ctx = ctx));
    canvas.focus();
    
  }
  // Add And Remove Event Listner
  addEventListeners = () => {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("wheel", this.handleScroll);
    this.canvas.addEventListener("keydown", this.handleKeyPress);
  };

  destroyEventListeners = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("wheel", this.handleScroll);
    this.canvas.removeEventListener("keydown", this.handleKeyPress);

  };


  private handleKeyPress = (e : KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        this.scaleUp();
      } else if (e.key === "-") {
        e.preventDefault();
        this.scaleDown();
      } else if (e.key === "0") {
        e.preventDefault();
        this.scale = 1;
        this.drawCanvas({ isScrolling: false });
      }
      window.dispatchEvent(new Event("scale-change"));
    }
  }
  private handleScroll = (e: WheelEvent) => {
    e.preventDefault();

    if(this.maxScrollX === 0 || this.maxScrollY === 0){
      console.log("Scroll Not possible")
      return 
    }
    const deltaX = e.deltaX / 4;
    const deltaY = e.deltaY / 4;
        
    this.scrollPositionX = Math.max(-this.maxScrollX, Math.min(this.maxScrollX, this.scrollPositionX + deltaX));
    this.scrollPositionY = Math.max(-this.maxScrollY, Math.min(this.maxScrollY, this.scrollPositionY + deltaY));
    this.drawCanvas({ isScrolling: true });
  };

  private handleMouseDown = (e: MouseEvent) => {
    this.interactionBehaviours
      .get(this.selectedTool)!
      .onMouseDown(this.createBehaviorContext(e));
  };
  private handleMouseMove = (e: MouseEvent) => {
    this.interactionBehaviours
      .get(this.selectedTool)!
      .onMouseMove(this.createBehaviorContext(e));
  };
  private handleMouseUp = (e: MouseEvent) => {
    this.interactionBehaviours
      .get(this.selectedTool)!
      .onMouseUp(this.createBehaviorContext(e));
    console.log(this.shapes);
  };

  // Draw and render on canvas method
  drawCanvas = ({ isScrolling }: { isScrolling: boolean }) => {
    this.ctx.save();

    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width , this.canvas.height );
    
    this.ctx.translate(-this.scrollPositionX, -this.scrollPositionY);
    this.ctx.scale(this.scale, this.scale);


    // Rendering the Shapes from history
    this.shapes.map((shape) => {
      this.interactionBehaviours
        .get(shape.type)!
        .renderShapes({ roughCanvas: this.roughCanvas }, shape);
    });

    // Drawing the shape preview
    if (!isScrolling) {
      this.interactionBehaviours
        .get(this.selectedTool)!
        .previewShape({ roughCanvas: this.roughCanvas });
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

  getShape = () : Shape[] => {
    return this.shapes
  }

  getRedoShape = () : Shape[] => {
    return this.shapes
  }

  undo = () => {
    if(this.shapes.length  > 0){
      const shape = this.shapes[this.shapes.length - 1] as Shape;
      this.redoShape.push(shape);
      this.shapes.pop();
      this.drawCanvas({isScrolling : false});
    }
    console.log("Undo Not Possible")
  }

  redo = () => {
    if(this.redoShape.length > 0){
      const shape = this.redoShape[this.redoShape.length - 1] as Shape;
      this.shapes.push(shape);
      this.redoShape.pop();
      this.drawCanvas({isScrolling : false});
    } 
    console.log("Redo Not Possible")

  }


  getScale = (): string => {
    return `${(this.scale * 100).toFixed(0)}%` 
  }

  setMaxScroll = () => {
    this.maxScrollX = this.canvas.width * (this.maxScale - 1); 
    this.maxScrollY = this.canvas.height * (this.maxScale - 1);
  }

  scaleUp = () => {
    const scaleFactor = 1.1; // 10% increase
    this.scale = Math.min(this.maxScale, this.scale * scaleFactor);
    this.ctx.scale(scaleFactor, scaleFactor);
    this.drawCanvas({ isScrolling: false });
    console.log("New scale:", this.scale);
  } 

  scaleDown = () => {
    console.log("Scaling down");
    const scaleFactor = 0.9; // 10% decrease
    this.scale = Math.max(this.minScale, this.scale * scaleFactor);
    this.ctx.scale(scaleFactor, scaleFactor);
    this.drawCanvas({ isScrolling: false });
    console.log("New scale:", this.scale);
  }

  // Helper
  private getCoordinateAdjustedByScroll = (
    coorX: number,
    coorY: number,
  ): { x: number; y: number } => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = (coorX - canvasRect.left + this.scrollPositionX) / this.scale  ;
    const y = (coorY - canvasRect.top + this.scrollPositionY) / this.scale  ;

    return { x, y };
  };

  private getRendererForShape(shape: Shape): IShapeRenders<Shape> | null {
    const behavior = this.interactionBehaviours.get(shape.type);
    return behavior?.getShapeRenderer ? behavior.getShapeRenderer() : null;
  }

  private createBehaviorContext(e: MouseEvent): BehaviorContext {
    const { x, y } = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY);
    return {
      x,
      y,
      shapes: this.shapes,
      canvas: this.canvas,
      ctx: this.ctx,
      roughCanvas: this.roughCanvas,
      addShape: (shape) => this.shapes.push(shape),
      requestRedraw: (isScrolling = false) => this.drawCanvas({ isScrolling }),
      isPointInShape: (shape: Shape, px: number, py: number) => {
        const renderer = this.getRendererForShape(shape);
        return renderer ? renderer.isPointInShape(shape, px, py) : false;
      },
    };
  }
}
