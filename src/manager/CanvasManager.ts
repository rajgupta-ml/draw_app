import type { Shape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RoughCanvas } from "roughjs/bin/canvas";
import { InteractionBehaviourList } from "@/canvas/shapes/ShapeClassList";
import type {
  BehaviorContext,
} from "@/canvas/InteractionBehaviour/baseclass";
import type { IShapeRenders } from "@/canvas/shapes/baseClass";
import { shapeConfig } from "@/constants/canvasConstant";
import type { Options } from "roughjs/bin/core";
import type { sidebarType } from "@/context/useSidebar";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
import { strokeColor } from "@/components/ui/configLayout/constant";

export class CanvasManager {
  private interactionBehaviours: typeof InteractionBehaviourList = InteractionBehaviourList;
  private roughCanvas: RoughCanvas;
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
  private theme: string | null = null;
  private config: TextOptionsPlusGeometricOptions | null = null
  constructor(
    private canvas: HTMLCanvasElement, 
    private ctx: CanvasRenderingContext2D, 
    private offScreenCanvas: HTMLCanvasElement, 
    private offScreenCanvasctx: CanvasRenderingContext2D,
    private inputArea : HTMLDivElement,
    private toggleSidebar : (args : sidebarType | null) => void,
  ) {
    this.theme = window.localStorage.getItem("theme");
    this.theme === "dark" ? shapeConfig.stroke = "white" : shapeConfig.stroke = "black"
    this.roughCanvas = new RoughCanvas(this.offScreenCanvas);
    this.selectedTool = TOOLS_NAME.RECT
    this.canvas.style.cursor = "crosshair"
    canvas.focus();
    
  }
  // Add And Remove Event Listner
  addEventListeners = () => {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("wheel", this.handleScroll);
    this.canvas.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener("theme-change", this.handleThemeChange)
    window.addEventListener("configChange", this.handlefetchConfig);
  
  };

  destroyEventListeners = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("wheel", this.handleScroll);
    this.canvas.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("theme-change", this.handleThemeChange)
    window.removeEventListener("configChange", this.handlefetchConfig);


  };


  

  private handlefetchConfig =(event : Event) => {
    this.config = ((event as CustomEvent).detail.config) as TextOptionsPlusGeometricOptions 
  }
  private handleThemeChange = (event : Event) => {
    const theme = (event as CustomEvent).detail.theme;
    this.theme = theme;
    this.drawCanvas({isScrolling : false})
  }

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
        this.scrollPositionX = 0;
        this.scrollPositionY = 0;
        this.drawCanvas({ isScrolling: false });

      }
      window.dispatchEvent(new Event("scale-change"));
    }
  }

  private handleScroll = (e: WheelEvent) => {

    if(this.selectedTool === TOOLS_NAME.HAND) {
      e.preventDefault();
      return;
    };

    
    e.preventDefault();

    if(this.maxScrollX === 0 || this.maxScrollY === 0){
      console.log("Scroll Not possible")
      return 
    }
    const deltaX = e.deltaX ;
    const deltaY = e.deltaY ;
        
    this.scrollPositionX = Math.max(-this.maxScrollX, Math.min(this.maxScrollX, this.scrollPositionX + deltaX));
    this.scrollPositionY = Math.max(-this.maxScrollY, Math.min(this.maxScrollY, this.scrollPositionY + deltaY));
    this.drawCanvas({ isScrolling: true });
  };

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
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
  };

  // Draw and render on canvas method
  drawCanvas = ({ isScrolling }: { isScrolling: boolean }) => {
    window.dispatchEvent(new Event("get-config-data"))
    const targetCtx = this.offScreenCanvasctx;
    const targetRoughCanvas = this.roughCanvas
    targetCtx.save();

    targetCtx.resetTransform();
    targetCtx.clearRect(0, 0, this.canvas.width , this.canvas.height );
    
    targetCtx.scale(this.scale, this.scale);
    targetCtx.translate(-this.scrollPositionX, -this.scrollPositionY);
    
    this.shapes.map((shape) => {

      if (shape.config) {
        const themeDefaultStroke = this.theme === "dark" ? strokeColor.dark[0] : strokeColor.light[0];
        if (
          shape.config.stroke === strokeColor.light[0] ||
          shape.config.stroke === strokeColor.dark[0]
        ) {
          shape.config.stroke = themeDefaultStroke as string;
        }
      }


      const behavior = this.interactionBehaviours.get(shape.type);
      if(behavior && behavior.renderShapes){
        behavior.renderShapes({roughCanvas : targetRoughCanvas, ctx : targetCtx}, shape)
      }
    });

    // Drawing the shape preview
    if (!isScrolling) {
      const behavior = this.interactionBehaviours.get(this.selectedTool);
      if(behavior && behavior.previewShape){
        // We ask for the config 
        const config = (this.config ?? shapeConfig) as TextOptionsPlusGeometricOptions;
        behavior.previewShape({roughCanvas : targetRoughCanvas, ctx : targetCtx}, config)
      }
    }
    targetCtx.restore();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
    this.ctx.drawImage(this.offScreenCanvas, 0, 0);  
    };

  // Setter and Getter Methods
  setTool = (tool: TOOLS_NAME) => {
    this.selectedTool = tool;
    

    if(this.selectedTool === TOOLS_NAME.HAND){
      this.canvas.style.cursor = "grab"
    }else{
      this.canvas.style.cursor = "crosshair"
    }
    
    if(this.selectedTool == TOOLS_NAME.TEXT){
      this.toggleSidebar("text")
    }else if(this.selectedTool === TOOLS_NAME.ERASER || this.selectedTool === TOOLS_NAME.HAND){
      console.log("I reach here")
      this.toggleSidebar(null)
    }else{
      this.toggleSidebar("geometry");
    }
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

    const oldScale = this.scale;
    const scaleFactor = 1.1; // 10% increase
    const newScale = Math.min(this.maxScale, this.scale * scaleFactor);
    
    const centerScreenX = this.canvas.width / 2;
    const centerScreenY = this.canvas.height / 2;

    const worldCenterX = centerScreenX / oldScale + this.scrollPositionX;
    const worldCenterY = centerScreenY / oldScale + this.scrollPositionY;

    this.scrollPositionX = worldCenterX - (centerScreenX / newScale);
    this.scrollPositionY = worldCenterY - (centerScreenY / newScale);

    this.scale = newScale;
    this.drawCanvas({ isScrolling: false });
  } 

  scaleDown = () => {
    const scaleFactor = 0.9; // 10% decrease
    const oldScale = this.scale;
    const newScale = Math.max(this.minScale, this.scale * scaleFactor);

    const centerScreenX = this.canvas.width / 2;
    const centerScreenY = this.canvas.height / 2;

    const worldCenterX = centerScreenX / oldScale + this.scrollPositionX;
    const worldCenterY = centerScreenY / oldScale + this.scrollPositionY;

    this.scrollPositionX = worldCenterX - (centerScreenX / newScale);
    this.scrollPositionY = worldCenterY - (centerScreenY / newScale);

    this.scale = newScale;
    this.drawCanvas({ isScrolling: false });
  }

  // Helper
  private getCoordinateAdjustedByScrollAndScale = (
    coorX: number,
    coorY: number,
  ): { x: number; y: number } => {
    const canvasRect = this.canvas.getBoundingClientRect();

    const rawX  = coorX - canvasRect.left
    const rawY  = coorY - canvasRect.top

    const worldX = (rawX / this.scale) + this.scrollPositionX;
    const worldY = (rawY / this.scale) + this.scrollPositionY;

    return { x : worldX, y : worldY };
  };

  private getRendererForShape(shape: Shape): IShapeRenders<Shape> | null {
    const behavior = this.interactionBehaviours.get(shape.type);
    return behavior?.getShapeRenderer ? behavior.getShapeRenderer() : null;
  }

  private createBehaviorContext(e: MouseEvent): BehaviorContext {
    const { x, y } = this.getCoordinateAdjustedByScrollAndScale(e.clientX, e.clientY);
    return {
      rawX : e.clientX,
      rawY : e.clientY,
      x,
      y,
      shapes: this.shapes,
      canvas: this.canvas,
      inputArea : this.inputArea,
      ctx: this.offScreenCanvasctx,
      roughCanvas: this.roughCanvas,
      config : this.config as Options,
      addShape: (shape) => this.shapes.push(shape),
      removeShape: (id : string) => {
        const index = this.shapes.findIndex(shape => shape.id === id);
        console.log({index})
        if (index !== -1) this.shapes.splice(index, 1);
      },
      addRedoShape : (shape) => this.redoShape.push(shape),
      requestRedraw: (isScrolling = false) => this.drawCanvas({ isScrolling }),
      isPointInShape: (shape: Shape, px: number, py: number) => {
        const renderer = this.getRendererForShape(shape);
        return renderer ? renderer.isPointInShape(shape, px, py) : false;
      },
      getScrollPositionX : () => this.scrollPositionX,
      getScrollPositionY : () => this.scrollPositionY,
      setScrollPositionX : (x : number ) => this.scrollPositionX = x,
      setScrollPositionY : (y : number ) => this.scrollPositionY = y

    };
  }
}
