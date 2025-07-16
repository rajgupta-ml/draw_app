import type { Shape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RoughCanvas } from "roughjs/bin/canvas";
import { InteractionBehaviourList } from "@/canvas/shapes/ShapeClassList";
import type { BehaviorContext } from "@/canvas/InteractionBehaviour/baseclass";
import type { IShapeRenders } from "@/canvas/shapes/baseClass";
import { shapeConfig } from "@/constants/canvasConstant";
import type { sidebarType } from "@/context/useSidebar";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
import { strokeColor } from "@/components/ui/configLayout/constant";
import type { ICommand } from "@/canvas/UndoAndRedoCmd/baseClass";

interface IThemeEventDetail {
  theme: string;
}

interface IConfigEventDetail {
  config: TextOptionsPlusGeometricOptions;
}

export class CanvasManager {
  roughCanvas: RoughCanvas;
  scrollPositionX = 0;
  scrollPositionY = 0;
  shapes: Shape[] = [];
  config: TextOptionsPlusGeometricOptions;
  selectedTool: TOOLS_NAME;
  scale = 1;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  offScreenCanvas: HTMLCanvasElement;
  offScreenCanvasctx: CanvasRenderingContext2D;
  inputArea: HTMLDivElement;
  private interactionBehaviours: typeof InteractionBehaviourList =
    InteractionBehaviourList;
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private operationNumber = 0;
  private maxScrollX = 0;
  private maxScrollY = 0;
  private minScale = 0.1;
  private maxScale = 10;
  private maxHistorySize = 100;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    offScreenCanvas: HTMLCanvasElement,
    offScreenCanvasctx: CanvasRenderingContext2D,
    inputArea: HTMLDivElement,
    config: TextOptionsPlusGeometricOptions,
    private theme : string,
    private toggleSidebar: (args: sidebarType | null) => void,
  ) {
    this.config = config;
    this.canvas = canvas;
    this.ctx = ctx;
    this.offScreenCanvas = offScreenCanvas;
    this.offScreenCanvasctx = offScreenCanvasctx;
    this.inputArea = inputArea;
    this.roughCanvas = new RoughCanvas(this.offScreenCanvas);
    this.config.stroke = this.theme === "dark" ? strokeColor.dark[0] : strokeColor.light[0]; 
    this.selectedTool = TOOLS_NAME.RECT;
    this.canvas.style.cursor = "crosshair";
    canvas.focus();
  }
  // Add And Remove Event Listner
  addEventListeners = () => {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("wheel", this.handleScroll);
    this.canvas.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener(
      "theme-change",
      this.handleThemeChange as EventListener,
    );
    window.addEventListener(
      "configChange",
      this.handlefetchConfig as EventListener,
    );
  };

  destroyEventListeners = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("wheel", this.handleScroll);
    this.canvas.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener(
      "theme-change",
      this.handleThemeChange as EventListener,
    );
    window.removeEventListener(
      "configChange",
      this.handlefetchConfig as EventListener,
    );
  };

  private handlefetchConfig = (event: Event) => {
    this.config = (event as CustomEvent<IConfigEventDetail>).detail.config;
  };
  private handleThemeChange = (event: Event) => {
    const theme = (event as CustomEvent<IThemeEventDetail>).detail.theme;
    this.theme = theme;
    this.drawCanvas();
  };

  private handleKeyPress = (e: KeyboardEvent) => {
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
        this.drawCanvas();
      }
      window.dispatchEvent(new Event("scale-change"));
    }
  };

  private handleScroll = (e: WheelEvent) => {
    if (this.selectedTool === TOOLS_NAME.HAND) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    if (this.maxScrollX === 0 || this.maxScrollY === 0) {
      console.log("Scroll Not possible");
      return;
    }
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;

    this.scrollPositionX = Math.max(
      -this.maxScrollX,
      Math.min(this.maxScrollX, this.scrollPositionX + deltaX),
    );
    this.scrollPositionY = Math.max(
      -this.maxScrollY,
      Math.min(this.maxScrollY, this.scrollPositionY + deltaY),
    );
    this.drawCanvas(true);
  };

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const behaviour = this.interactionBehaviours.get(this.selectedTool);
    if (behaviour) {
      behaviour.onMouseDown(this.createBehaviorContext(e));
    }
  };
  private handleMouseMove = (e: MouseEvent) => {
    const behaviour = this.interactionBehaviours.get(this.selectedTool);

    if (behaviour) {
      behaviour.onMouseMove(this.createBehaviorContext(e));
    }
  };
  private handleMouseUp = (e: MouseEvent) => {
    const behaviour = this.interactionBehaviours.get(this.selectedTool);

    if (behaviour) {
      behaviour.onMouseUp(this.createBehaviorContext(e));
    }
  };

  // Draw and render on canvas method
  drawCanvas = (isScrolling = false) => {
    this.offScreenCanvasctx.save();

    this.offScreenCanvasctx.resetTransform();
    this.offScreenCanvasctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    this.offScreenCanvasctx.scale(this.scale, this.scale);
    this.offScreenCanvasctx.translate(
      -this.scrollPositionX,
      -this.scrollPositionY,
    );

    this.shapes.map((shape) => {
      if (shape.config) {
        const themeDefaultStroke =
        this.theme === "dark" ? strokeColor.dark[0] : strokeColor.light[0]; 
        if (
          shape.config.stroke === strokeColor.light[0] ||
          shape.config.stroke === strokeColor.dark[0]
        ) {
          shape.config.stroke = themeDefaultStroke;
        }
      }

      const behavior = this.interactionBehaviours.get(shape.type);
      if (behavior?.renderShapes) {
        behavior.renderShapes(this, shape);
      }
    });

    // Drawing the shape preview
    if (!isScrolling) {
      const behavior = this.interactionBehaviours.get(this.selectedTool);
      if (behavior?.previewShape) {
        // We ask for the config
        const config = this.config ?? shapeConfig;
        behavior.previewShape(this, config);
      }
    }
    this.offScreenCanvasctx.restore();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.offScreenCanvas, 0, 0);
  };

  // Setter and Getter Methods
  setTool = (tool: TOOLS_NAME) => {
    this.selectedTool = tool;

    if (this.selectedTool === TOOLS_NAME.HAND) {
      this.canvas.style.cursor = "grab";
    } else {
      this.canvas.style.cursor = "crosshair";
    }

    if (this.selectedTool == TOOLS_NAME.TEXT) {
      this.toggleSidebar("text");
    } else if (
      this.selectedTool === TOOLS_NAME.ERASER ||
      this.selectedTool === TOOLS_NAME.HAND
    ) {
      console.log("I reach here");
      this.toggleSidebar(null);
    } else {
      this.toggleSidebar("geometry");
    }
  };

  getTool = (): TOOLS_NAME => {
    return this.selectedTool;
  };

  executeCmd = (command: ICommand) => {
    command.operationNumber = ++this.operationNumber;
    command.execute();
    this.undoStack.push(command);
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    console.log("undoStack: ", this.undoStack);
  };
  undo = () => {
    if (this.undoStack.length > 0) {
      const command = this.undoStack.pop();
      console.log("poped Cmd:", command);
      if (command) {
        command.undo();
        this.redoStack.push(command);
      }
    } else {
      console.log("Undo Not Possible: No actions to undo.");
    }
  };

  redo = () => {
    if (this.redoStack.length > 0) {
      const command = this.redoStack.pop();
      if (command) {
        command.execute();
        this.undoStack.push(command);
      }
    } else {
      console.log("Redo Not Possible: No actions to redo.");
    }
  };

  getScale = (): string => {
    return `${(this.scale * 100).toFixed(0)}%`;
  };

  setMaxScroll = () => {
    this.maxScrollX = this.canvas.width * (this.maxScale - 1);
    this.maxScrollY = this.canvas.height * (this.maxScale - 1);
  };

  scaleUp = () => {
    const oldScale = this.scale;
    const scaleFactor = 1.1; // 10% increase
    const newScale = Math.min(this.maxScale, this.scale * scaleFactor);

    const centerScreenX = this.canvas.width / 2;
    const centerScreenY = this.canvas.height / 2;

    const worldCenterX = centerScreenX / oldScale + this.scrollPositionX;
    const worldCenterY = centerScreenY / oldScale + this.scrollPositionY;

    this.scrollPositionX = worldCenterX - centerScreenX / newScale;
    this.scrollPositionY = worldCenterY - centerScreenY / newScale;

    this.scale = newScale;
    this.drawCanvas();
  };

  scaleDown = () => {
    const scaleFactor = 0.9; // 10% decrease
    const oldScale = this.scale;
    const newScale = Math.max(this.minScale, this.scale * scaleFactor);

    const centerScreenX = this.canvas.width / 2;
    const centerScreenY = this.canvas.height / 2;

    const worldCenterX = centerScreenX / oldScale + this.scrollPositionX;
    const worldCenterY = centerScreenY / oldScale + this.scrollPositionY;

    this.scrollPositionX = worldCenterX - centerScreenX / newScale;
    this.scrollPositionY = worldCenterY - centerScreenY / newScale;

    this.scale = newScale;
    this.drawCanvas();
  };

  // Helper
  private getCoordinateAdjustedByScrollAndScale = (
    coorX: number,
    coorY: number,
  ): { x: number; y: number } => {
    const canvasRect = this.canvas.getBoundingClientRect();

    const rawX = coorX - canvasRect.left;
    const rawY = coorY - canvasRect.top;

    const worldX = rawX / this.scale + this.scrollPositionX;
    const worldY = rawY / this.scale + this.scrollPositionY;

    return { x: worldX, y: worldY };
  };

  private getRendererForShape(shape: Shape): IShapeRenders<Shape> | null {
    const behavior = this.interactionBehaviours.get(shape.type);
    return behavior?.getShapeRenderer ? behavior.getShapeRenderer() : null;
  }

  private createBehaviorContext(e: MouseEvent): BehaviorContext {
    const { x, y } = this.getCoordinateAdjustedByScrollAndScale(
      e.clientX,
      e.clientY,
    );
    return {
      manager: this,
      rawX: e.clientX,
      rawY: e.clientY,
      x,
      y,
      executeCanvasCommnad: (command: ICommand) => this.executeCmd(command),
      isPointInShape: (shape: Shape, px: number, py: number) => {
        const renderer = this.getRendererForShape(shape);
        return renderer ? renderer.isPointInShape(shape, px, py) : false;
      },
      setScrollPositionX: (x: number) => (this.scrollPositionX = x),
      setScrollPositionY: (y: number) => (this.scrollPositionY = y),
    };
  }
}
