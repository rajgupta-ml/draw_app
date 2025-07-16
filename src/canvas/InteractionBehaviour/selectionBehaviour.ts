import type {
  Shape,
  RectShape,
  LineShape,
  RightArrowShape,
  PenShape,
  EclipseShape,
  DiamondShape,
  TextShape,
} from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { BehaviorContext, IInteractionBehavior } from "./baseclass";
import type { CanvasManager } from "@/manager/CanvasManager";

type SelectionAction = "IDLE" | "MOVING" | "RESIZING" | "SELECTING_AREA";
type ResizeHandlePosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "top"
  | "bottom"
  | "left"
  | "right";
interface ResizeHandle {
  position: ResizeHandlePosition;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SelectionBehavior implements IInteractionBehavior {
  private currentAction: SelectionAction = "IDLE";
  private selectedShapes: Shape[] = [];
  private selectionBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null = null;
  private resizeHandles: ResizeHandle[] = [];
  private clickedResizeHandle: ResizeHandlePosition | null = null;
  private ctx : CanvasRenderingContext2D | null = null;
  private initialMousePosition = { x: 0, y: 0 };
  private initialShapesState: Shape[] = [];
  private selectionArea: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null = null;

  onMouseDown({ 
    x,
    y,
    isPointInShape,
    manager
  }: BehaviorContext): void {
    const {offScreenCanvasctx, shapes, drawCanvas} = manager
    this.ctx = offScreenCanvasctx;
    this.initialMousePosition = { x, y };

    const handle = this.getClickedResizeHandle(x, y);
    if (handle) {
      this.currentAction = "RESIZING";
      this.clickedResizeHandle = handle.position;
      this.initialShapesState = JSON.parse(JSON.stringify(this.selectedShapes));
      return;
    }

    if (this.selectionBox && this.isPointInBox(x, y, this.selectionBox)) {
      this.currentAction = "MOVING";
      this.initialShapesState = JSON.parse(JSON.stringify(this.selectedShapes));
      return;
    }

    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]!;
      if (isPointInShape(shape, x, y)) {
        this.selectedShapes = [shape];
        this.updateSelectionBox();
        this.currentAction = "MOVING";
        this.initialShapesState = JSON.parse(
          JSON.stringify(this.selectedShapes),
        );
        drawCanvas();
        if(this.selectedShapes.length > 0){
          manager.selectedShape = this.selectedShapes;
          // Write now edit can only be done on single shape not in group
          window.dispatchEvent(new CustomEvent("selectShape", {detail : {selectedShapes : this.selectedShapes[0] }}))
        }
          return;
      }
    }


    this.selectedShapes = [];
    this.selectionBox = null;
    this.resizeHandles = [];
    this.currentAction = "SELECTING_AREA";
    this.selectionArea = { x1: x, y1: y, x2: x, y2: y };
    drawCanvas();
  }

  onMouseMove({
    x,
    y,
    isPointInShape,
    manager
  }: BehaviorContext): void {
    const {offScreenCanvasctx, offScreenCanvas, shapes, drawCanvas} = manager
    this.ctx = offScreenCanvasctx;
    const dx = x - this.initialMousePosition.x;
    const dy = y - this.initialMousePosition.y;

    let cursorChanged = false;

    // Check if the mouse is over any resize handle
    if (this.currentAction === "IDLE") {
      const handle = this.getClickedResizeHandle(x, y);
      if (handle) {
        // Set specific cursors for resize handles
        switch (handle.position) {
          case "topLeft":
          case "bottomRight":
            offScreenCanvas.style.cursor = "nwse-resize";
            break;
          case "topRight":
          case "bottomLeft":
            offScreenCanvas.style.cursor = "nesw-resize";
            break;
          case "top":
          case "bottom":
            offScreenCanvas.style.cursor = "ns-resize";
            break;
          case "left":
          case "right":
            offScreenCanvas.style.cursor = "ew-resize";
            break;
        }
        cursorChanged = true;
      } else if (
        this.selectionBox &&
        this.isPointInBox(x, y, this.selectionBox)
      ) {
        offScreenCanvas.style.cursor = "move";
        cursorChanged = true;
      } else {
        for (let i = shapes.length - 1; i >= 0; i--) {
          const shape = shapes[i]!;
          if (isPointInShape(shape, x, y)) {
            offScreenCanvas.style.cursor = "grab";
            cursorChanged = true;
            break;
          }
        }
      }
    } else if (this.currentAction === "RESIZING" && this.clickedResizeHandle) {
      switch (this.clickedResizeHandle) {
        case "topLeft":
        case "bottomRight":
          offScreenCanvas.style.cursor = "nwse-resize";
          break;
        case "topRight":
        case "bottomLeft":
          offScreenCanvas.style.cursor = "nesw-resize";
          break;
        case "top":
        case "bottom":
          offScreenCanvas.style.cursor = "ns-resize";
          break;
        case "left":
        case "right":
          offScreenCanvas.style.cursor = "ew-resize";
          break;
      }
      cursorChanged = true;
    } else if (this.currentAction === "MOVING") {
      offScreenCanvas.style.cursor = "grabbing";
      cursorChanged = true;
    } else if (this.currentAction === "SELECTING_AREA") {
      offScreenCanvas.style.cursor = "crosshair";
      cursorChanged = true;
    }

    if (!cursorChanged) {
      offScreenCanvas.style.cursor = "default";
    }

    switch (this.currentAction) {
      case "MOVING":
        this.moveShapes(dx, dy);
        drawCanvas();
        break;
      case "RESIZING":
        if (this.clickedResizeHandle) {
          this.resizeShapes(dx, dy);
          drawCanvas();
        }
        break;
      case "SELECTING_AREA":
        if (this.selectionArea) {
          this.selectionArea.x2 = x;
          this.selectionArea.y2 = y;
          drawCanvas();
        }
        break;
    }
  }

  onMouseUp({manager}: BehaviorContext): void {
 
    const {offScreenCanvasctx, shapes,drawCanvas } = manager
    this.ctx = offScreenCanvasctx;
    if (this.currentAction === "SELECTING_AREA" && this.selectionArea) {
      this.selectShapesInArea(shapes);
    }
    this.currentAction = "IDLE";
    this.clickedResizeHandle = null;
    this.selectionArea = null;
    this.initialShapesState = [];
    drawCanvas();
  }

  previewShape(manager : CanvasManager): void {
    const {offScreenCanvasctx, roughCanvas} = manager
    this.ctx = offScreenCanvasctx;
    if (this.selectionBox) {
      roughCanvas.rectangle(
        this.selectionBox.x,
        this.selectionBox.y,
        this.selectionBox.width,
        this.selectionBox.height,
        { stroke: "#007bff", strokeWidth: 1, strokeLineDash: [4, 4] },
      );
      this.resizeHandles.forEach((handle) =>
        roughCanvas.rectangle(handle.x, handle.y, handle.width, handle.height, {
          fill: "#007bff",
          fillStyle: "solid",
          stroke: "white",
          strokeWidth: 1,
        }),
      );
    }
    if (this.selectionArea) {
      const { x1, y1, x2, y2 } = this.selectionArea;
      roughCanvas.rectangle(x1, y1, x2 - x1, y2 - y1, {
        stroke: "#007bff",
        strokeWidth: 0.5,
        fill: "rgba(0, 123, 255, 0.1)",
        fillStyle: "solid",
      });
    }
  }


  private updateSelectionBox(): void {
    if (this.selectedShapes.length === 0) {
      this.selectionBox = null;
      this.resizeHandles = [];
      return;
    }

    const allX = this.selectedShapes.flatMap((s) => {
      switch (s.type) {
        case TOOLS_NAME.RECT:
          const r = s as RectShape;
          return [r.x, r.x + r.w];
        case TOOLS_NAME.ECLIPSE:
          const ellipse = s as EclipseShape;
          return [ellipse.x - ellipse.w / 2, ellipse.x + ellipse.w / 2];
        case TOOLS_NAME.DIAMOND:
          return [(s as RectShape).x, (s as RectShape).x + (s as RectShape).w];
        case TOOLS_NAME.LINE:
          return [(s as LineShape).x1, (s as LineShape).x2];
        case TOOLS_NAME.RIGHT_ARROW:
          return [(s as RightArrowShape).startX, (s as RightArrowShape).endX];
        case TOOLS_NAME.PEN:
          return (s as PenShape).lineArray.map(([px, _]) => px);
          case TOOLS_NAME.TEXT: {
            const textShape = s as TextShape;
            // Use recalculateTextWidth if possible, otherwise fallback to textShape.w
            const width = this.ctx ? this.recalculateTextWidth(textShape) : textShape.w;
            return [textShape.x, textShape.x + width];  
          }
        default:
          return [];
      }
    });

    const allY = this.selectedShapes.flatMap((s) => {
      switch (s.type) {
        case TOOLS_NAME.RECT:
          const r = s as RectShape;
          return [r.y, r.y + r.h];
        case TOOLS_NAME.ECLIPSE:
          const ellipse = s as EclipseShape;
          return [ellipse.y - ellipse.h / 2, ellipse.y + ellipse.h / 2];
        case TOOLS_NAME.DIAMOND:
          const d = s as DiamondShape;
          return [d.y, d.y + d.h];
        case TOOLS_NAME.LINE:
          const l = s as LineShape;
          return [l.y1, l.y2];
        case TOOLS_NAME.RIGHT_ARROW:
          return [(s as RightArrowShape).startY, (s as RightArrowShape).endY];
        case TOOLS_NAME.PEN:
          const p = s as PenShape;
          return p.lineArray.map(([_, py]) => py);
        case TOOLS_NAME.TEXT:{
          const textShape = s as TextShape;
          const fontSizeStr = textShape.config.fontSize || "10";
          const fontSize = parseInt(fontSizeStr.replace('px', ''));
          return [textShape.y, textShape.y + fontSize + 5];
        }
        default:
          return [];
      }
    });

    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);

    this.selectionBox = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
    this.updateResizeHandles();
  }

  private moveShapes(dx: number, dy: number): void {
    this.selectedShapes.forEach((shape, index) => {
      const initialState = this.initialShapesState[index]!;

      switch (shape.type) {
        case TOOLS_NAME.RECT:
        case TOOLS_NAME.ECLIPSE:
        case TOOLS_NAME.TEXT:
        case TOOLS_NAME.DIAMOND:
          (shape as RectShape).x = (initialState as RectShape).x + dx;
          (shape as RectShape).y = (initialState as RectShape).y + dy;
          break;
        case TOOLS_NAME.LINE:
          (shape as LineShape).x1 = (initialState as LineShape).x1 + dx;
          (shape as LineShape).y1 = (initialState as LineShape).y1 + dy;
          (shape as LineShape).x2 = (initialState as LineShape).x2 + dx;
          (shape as LineShape).y2 = (initialState as LineShape).y2 + dy;
          break;
        case TOOLS_NAME.RIGHT_ARROW:
          (shape as RightArrowShape).startX =
            (initialState as RightArrowShape).startX + dx;
          (shape as RightArrowShape).startY =
            (initialState as RightArrowShape).startY + dy;
          (shape as RightArrowShape).endX =
            (initialState as RightArrowShape).endX + dx;
          (shape as RightArrowShape).endY =
            (initialState as RightArrowShape).endY + dy;
          break;
        case TOOLS_NAME.PEN:
          (shape as PenShape).lineArray = (
            initialState as PenShape
          ).lineArray.map(([px, py]) => [px + dx, py + dy]);
          break;
        
      }
    });
    this.updateSelectionBox();
  }

  private resizeShapes(dx: number, dy: number) {
    if (
      !this.selectionBox ||
      !this.clickedResizeHandle ||
      !this.initialShapesState.length
    )
      return;

    const initialBox = {
      x: Math.min(
        ...this.initialShapesState.flatMap((s) => this.getShapeBounds(s).allX),
      ),
      y: Math.min(
        ...this.initialShapesState.flatMap((s) => this.getShapeBounds(s).allY),
      ),
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
    };
    initialBox.maxX = Math.max(
      ...this.initialShapesState.flatMap((s) => this.getShapeBounds(s).allX),
    );
    initialBox.maxY = Math.max(
      ...this.initialShapesState.flatMap((s) => this.getShapeBounds(s).allY),
    );
    initialBox.width = initialBox.maxX - initialBox.x;
    initialBox.height = initialBox.maxY - initialBox.y;

    const handle = this.clickedResizeHandle;

    let newX = initialBox.x;
    let newY = initialBox.y;
    let newWidth = initialBox.width;
    let newHeight = initialBox.height;

    // Calculate new dimensions and position based on the handle being dragged
    switch (handle) {
      case "topLeft":
        newWidth = initialBox.width - dx;
        newHeight = initialBox.height - dy;
        newX =initialBox.x + dx;
        newY = initialBox.y + dy;
        break;
      case "topRight":
        newWidth = initialBox.width + dx;
        newHeight = initialBox.height - dy;
        newY = initialBox.y + dy;
        break;
      case "bottomLeft":
        newWidth = initialBox.width - dx;
        newHeight = initialBox.height + dy;
        newX = initialBox.x + dx;
        break;
      case "bottomRight":
        newWidth = initialBox.width + dx;
        newHeight = initialBox.height + dy;
        break;
      case "top":
        newHeight = initialBox.height - dy;
        newY = initialBox.y + dy;
        break;
      case "bottom":
        newHeight = initialBox.height + dy;
        break;
      case "left":
        newWidth = initialBox.width - dx;
        newX = initialBox.x + dx;
        break;
      case "right":
        newWidth = initialBox.width + dx;
        break;
    }

    // Prevent negative width/height
    if (newWidth < 0) {
      newX = initialBox.maxX;
      newWidth = Math.abs(newWidth);
    }
    if (newHeight < 0) {
      newY = initialBox.maxY;
      newHeight = Math.abs(newHeight);
    }

    // Calculate scale factors
    const scaleX = initialBox.width > 0 ? newWidth / initialBox.width : 1;
    const scaleY = initialBox.height > 0 ? newHeight / initialBox.height : 1;

    // Determine the anchor point for scaling (opposite corner for corner handles)
    let anchorX = initialBox.x;
    let anchorY = initialBox.y;
    if (handle === "topLeft" || handle === "bottomLeft" || handle === "left") {
      anchorX = initialBox.maxX; // Right edge is fixed
    } else if (
      handle === "topRight" ||
      handle === "bottomRight" ||
      handle === "right"
    ) {
      anchorX = initialBox.x; // Left edge is fixed
    }
    if (handle === "topLeft" || handle === "topRight" || handle === "top") {
      anchorY = initialBox.maxY; // Bottom edge is fixed
    } else if (
      handle === "bottomLeft" ||
      handle === "bottomRight" ||
      handle === "bottom"
    ) {
      anchorY = initialBox.y; // Top edge is fixed
    }

    // Apply transformation to each selected shape
    this.selectedShapes.forEach((shape, index) => {
      const initialState = this.initialShapesState[index]!;

      // Function to transform a point based on the new bounding box and anchor
      const transform = (ix: number, iy: number) => {
        // Scale relative to the anchor point
        const scaledX = anchorX + (ix - anchorX) * scaleX;
        const scaledY = anchorY + (iy - anchorY) * scaleY;
        return { x: scaledX, y: scaledY };
      };

      switch (shape.type) {
        case TOOLS_NAME.RECT:
        case TOOLS_NAME.ECLIPSE:
        case TOOLS_NAME.DIAMOND: {
          const iState = initialState as RectShape;
          const p1 = transform(iState.x, iState.y);
          const p2 = transform(iState.x + iState.w, iState.y + iState.h);

          (shape as RectShape).x = Math.min(p1.x, p2.x);
          (shape as RectShape).y = Math.min(p1.y, p2.y);
          (shape as RectShape).w = Math.abs(p2.x - p1.x);
          (shape as RectShape).h = Math.abs(p2.y - p1.y);
          break;
        }
        case TOOLS_NAME.LINE: {
          const iState = initialState as LineShape;
          const p1 = transform(iState.x1, iState.y1);
          const p2 = transform(iState.x2, iState.y2);
          (shape as LineShape).x1 = p1.x;
          (shape as LineShape).y1 = p1.y;
          (shape as LineShape).x2 = p2.x;
          (shape as LineShape).y2 = p2.y;
          break;
        }
        case TOOLS_NAME.RIGHT_ARROW: {
          const iState = initialState as RightArrowShape;
          const p1 = transform(iState.startX, iState.startY);
          const p2 = transform(iState.endX, iState.endY);
          (shape as RightArrowShape).startX = p1.x;
          (shape as RightArrowShape).startY = p1.y;
          (shape as RightArrowShape).endX = p2.x;
          (shape as RightArrowShape).endY = p2.y;
          break;
        }
        case TOOLS_NAME.PEN: {
          const iState = initialState as PenShape;
          (shape as PenShape).lineArray = iState.lineArray.map(([px, py]) => {
            const { x, y } = transform(px, py);
            return [x, y];
          });
          break;
        }
        case TOOLS_NAME.TEXT: {
          const iState = initialState as TextShape;
          const textShape = shape as TextShape;
          
          // Transform position
          const p1 = transform(iState.x, iState.y);
          textShape.x = p1.x;
          textShape.y = p1.y;
          
          // Scale font size based on both X and Y scaling for better proportions
          const originalFontSizeStr = iState.config.fontSize || "10";
          const originalFontSize = parseInt(originalFontSizeStr.replace('px', ''));
          const scaleFactor = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
          const newFontSize = Math.max(1, Math.round(originalFontSize * scaleFactor));
          textShape.config.fontSize = `${newFontSize}px`;

          // Recalculate width using the new font size
          if (this.ctx) {
            textShape.w = this.recalculateTextWidth(textShape);
          } else {
            textShape.w = Math.round(iState.w * scaleX);
          }
          
          break;
        }
        
      }
    });
    this.updateSelectionBox();
  }

  /** Helper to get numerical bounds for any shape. */
  private getShapeBounds(shape: Shape): { allX: number[]; allY: number[] } {
    switch (shape.type) {
      case TOOLS_NAME.RECT:
        const rectShape = shape as RectShape;
        return {
          allX: [rectShape.x, rectShape.x + rectShape.w],
          allY: [rectShape.y, rectShape.y + rectShape.h],
        };
      case TOOLS_NAME.ECLIPSE:
        const ellipseShape = shape as EclipseShape;
        return {
          allX: [
            ellipseShape.x - ellipseShape.w / 2,
            ellipseShape.x + ellipseShape.w / 2,
          ],
          allY: [
            ellipseShape.y - ellipseShape.h / 2,
            ellipseShape.y + ellipseShape.h / 2,
          ],
        };
      case TOOLS_NAME.DIAMOND:
        const diamondShape = shape as DiamondShape;
        return {
          allX: [diamondShape.x, diamondShape.x + diamondShape.w],
          allY: [diamondShape.y, diamondShape.y + diamondShape.h],
        };
      case TOOLS_NAME.LINE:
        const lineShape = shape as LineShape;
        return {
          allX: [lineShape.x1, lineShape.x2],
          allY: [lineShape.y1, lineShape.y2],
        };
      case TOOLS_NAME.RIGHT_ARROW:
        return {
          allX: [
            (shape as RightArrowShape).startX,
            (shape as RightArrowShape).endX,
          ],
          allY: [
            (shape as RightArrowShape).startY,
            (shape as RightArrowShape).endY,
          ],
        };
      case TOOLS_NAME.PEN:
        return {
          allX: (shape as PenShape).lineArray.map(([px, _]) => px),
          allY: (shape as PenShape).lineArray.map(([_, py]) => py),
        };
      case TOOLS_NAME.TEXT: {
        const text = shape as TextShape;
        const fontSizeStr = text.config.fontSize || "10";
        const fontSize = parseInt(fontSizeStr.replace('px', ''));
        const width = this.ctx ? this.recalculateTextWidth(text) : text.w;
        return {
          allX: [text.x, text.x + width],
          allY: [text.y, text.y + fontSize + 5], // crude height estimate
        };
      }
        
      default:
        return { allX: [], allY: [] };
    }
  }

  private updateResizeHandles(): void {
    if (!this.selectionBox) return;
    const { x, y, width, height } = this.selectionBox;
    const handleSize = 10;
    const h = handleSize / 2;
    this.resizeHandles = [
      {
        position: "topLeft",
        x: x - h,
        y: y - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "topRight",
        x: x + width - h,
        y: y - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "bottomLeft",
        x: x - h,
        y: y + height - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "bottomRight",
        x: x + width - h,
        y: y + height - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "top",
        x: x + width / 2 - h,
        y: y - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "bottom",
        x: x + width / 2 - h,
        y: y + height - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "left",
        x: x - h,
        y: y + height / 2 - h,
        width: handleSize,
        height: handleSize,
      },
      {
        position: "right",
        x: x + width - h,
        y: y + height / 2 - h,
        width: handleSize,
        height: handleSize,
      },
    ];
  }
  private getClickedResizeHandle(x: number, y: number): ResizeHandle | null {
    return (
      this.resizeHandles.find((handle) => this.isPointInBox(x, y, handle)) ||
      null
    );
  }
  private selectShapesInArea(allShapes: Shape[]): void {
    if (!this.selectionArea) return;
    const { x1, y1, x2, y2 } = this.selectionArea;
    const selMinX = Math.min(x1, x2),
      selMinY = Math.min(y1, y2),
      selMaxX = Math.max(x1, x2),
      selMaxY = Math.max(y1, y2);
    this.selectedShapes = allShapes.filter((shape) => {
      const bounds = this.getShapeBounds(shape);
      const shapeMinX = Math.min(...bounds.allX),
        shapeMinY = Math.min(...bounds.allY),
        shapeMaxX = Math.max(...bounds.allX),
        shapeMaxY = Math.max(...bounds.allY);
      return (
        shapeMinX < selMaxX &&
        shapeMaxX > selMinX &&
        shapeMinY < selMaxY &&
        shapeMaxY > selMinY
      );
    });
    this.updateSelectionBox();
  }
  private isPointInBox(
    px: number,
    py: number,
    box: { x: number; y: number; width: number; height: number },
  ): boolean {
    return (
      px >= box.x &&
      px <= box.x + box.width &&
      py >= box.y &&
      py <= box.y + box.height
    );
  }

  private recalculateTextWidth(textShape: TextShape): number {
    const fontSizeStr = textShape.config.fontSize || '10';
    const fontSize = fontSizeStr.replace('px', '');
    const fontFamily = textShape.config.fontFamily || 'Arial';
    
    // Save current font
    const originalFont = this.ctx!.font;
    
    // Set font and measure
    this.ctx!.font = `${fontSize}px ${fontFamily}`;
    const width = this.ctx!.measureText(textShape.text || '').width;
    
    // Restore original font
    this.ctx!.font = originalFont;
    
    return Math.floor(width);
  }
}
