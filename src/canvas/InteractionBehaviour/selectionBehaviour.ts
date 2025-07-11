import type { Shape, RectShape, EclipseShape, LineShape, RightArrowShape, DiamondShape, PenShape } from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { BehaviorContext, IInteractionBehavior } from "./baseclass";
import type { Pen } from "../shapes/Pen";

// Type definitions for internal use (no changes here)
type SelectionAction = "IDLE" | "MOVING" | "RESIZING" | "SELECTING_AREA";
type ResizeHandlePosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "top" | "bottom" | "left" | "right";
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
    private selectionBox: { x: number, y: number, width: number, height: number } | null = null;
    private resizeHandles: ResizeHandle[] = [];
    private clickedResizeHandle: ResizeHandlePosition | null = null;
    
    private initialMousePosition = { x: 0, y: 0 };
    // The initial state now holds the new shape types
    private initialShapesState: Shape[] = [];
    private selectionArea: { x1: number, y1: number, x2: number, y2: number } | null = null;

 
    onMouseDown({ x, y, shapes, requestRedraw, isPointInShape }: BehaviorContext): void {
        this.initialMousePosition = { x, y };

        const handle = this.getClickedResizeHandle(x, y);
        if (handle) {
            this.currentAction = "RESIZING";
            this.clickedResizeHandle = handle.position;
            // Create a deep copy of the initial state for manipulation
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
                this.initialShapesState = JSON.parse(JSON.stringify(this.selectedShapes));
                requestRedraw();
                return;
            }
        }
        
        this.selectedShapes = [];
        this.selectionBox = null;
        this.resizeHandles = [];
        this.currentAction = "SELECTING_AREA";
        this.selectionArea = { x1: x, y1: y, x2: x, y2: y };
        requestRedraw();
    }
    
    onMouseMove({ x, y, requestRedraw }: BehaviorContext): void {
        const dx = x - this.initialMousePosition.x;
        const dy = y - this.initialMousePosition.y;

        switch (this.currentAction) {
            case "MOVING":
                this.moveShapes(dx, dy);
                requestRedraw();
                break;
            case "RESIZING":
                 if (this.clickedResizeHandle) {
                    this.resizeShapes(dx, dy);
                    requestRedraw();
                }
                break;
            case "SELECTING_AREA":
                if (this.selectionArea) {
                    this.selectionArea.x2 = x;
                    this.selectionArea.y2 = y;
                    requestRedraw();
                }
                break;
        }
    }
    
    onMouseUp({ shapes, requestRedraw }: BehaviorContext): void {
        if (this.currentAction === "SELECTING_AREA" && this.selectionArea) {
            this.selectShapesInArea(shapes);
        }
        this.currentAction = "IDLE";
        this.clickedResizeHandle = null;
        this.selectionArea = null;
        this.initialShapesState = [];
        requestRedraw();
    }
    
    previewShape({ roughCanvas }: Pick<BehaviorContext, "roughCanvas">): void {
        // This method does not need changes
        if (this.selectionBox) {
            roughCanvas.rectangle(this.selectionBox.x, this.selectionBox.y, this.selectionBox.width, this.selectionBox.height, { stroke: '#007bff', strokeWidth: 1, strokeLineDash: [4, 4] });
            this.resizeHandles.forEach(handle => roughCanvas.rectangle(handle.x, handle.y, handle.width, handle.height, { fill: '#007bff', fillStyle: 'solid', stroke: 'white', strokeWidth: 1 }));
        }
        if(this.selectionArea) {
             const {x1, y1, x2, y2} = this.selectionArea;
             roughCanvas.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: '#007bff', strokeWidth: 0.5, fill: 'rgba(0, 123, 255, 0.1)', fillStyle: 'solid' });
        }
    }

    renderShapes(): void { /* No-op */ }

    // --- Private Helper Methods ---

    /**
     * ✅ UPDATED: Calculates the bounding box for the current selection,
     * handling different shape properties.
     */
    private updateSelectionBox(): void {
        if (this.selectedShapes.length === 0) {
            this.selectionBox = null;
            this.resizeHandles = [];
            return;
        }

        const allX = this.selectedShapes.flatMap(s => {
            switch (s.type) {
                case TOOLS_NAME.RECT:
                case TOOLS_NAME.ECLIPSE:
                case TOOLS_NAME.DIAMOND:
                    return [(s as RectShape).x, (s as RectShape).x + (s as RectShape).w];
                case TOOLS_NAME.LINE:
                    return [(s as LineShape).x1, (s as LineShape).x2];
                case TOOLS_NAME.RIGHT_ARROW:
                    // Assuming RightArrow still uses start/end
                    return [(s as RightArrowShape).startX, (s as RightArrowShape).endX];
                case TOOLS_NAME.PEN:
                    return (s as PenShape).lineArray.map(([px, _]) => px);
                default: return [];
            }
        });

        const allY = this.selectedShapes.flatMap(s => {
            switch (s.type) {
                case TOOLS_NAME.RECT:
                case TOOLS_NAME.ECLIPSE:
                case TOOLS_NAME.DIAMOND:
                    const r = s as RectShape
                    return [r.y, r.y + r.h];
                case TOOLS_NAME.LINE:
                    const l = s as LineShape
                    return [l.y1, l.y2];
                case TOOLS_NAME.RIGHT_ARROW:
                    return [(s as RightArrowShape).startY, (s as RightArrowShape).endY];
                case TOOLS_NAME.PEN:
                    const p = s as PenShape
                    return p.lineArray.map(([_, py]) => py);
                default: return [];
            }
        });

        const minX = Math.min(...allX);
        const minY = Math.min(...allY);
        const maxX = Math.max(...allX);
        const maxY = Math.max(...allY);
        
        this.selectionBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        this.updateResizeHandles();
    }

    /**
     * ✅ UPDATED: Moves shapes by dx and dy, handling different shape properties.
     */
    private moveShapes(dx: number, dy: number): void {
        this.selectedShapes.forEach((shape, index) => {
            const initialState = this.initialShapesState[index]!;
            
            switch (shape.type) {
                case TOOLS_NAME.RECT:
                case TOOLS_NAME.ECLIPSE:
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
                    (shape as RightArrowShape).startX = (initialState as RightArrowShape).startX + dx;
                    (shape as RightArrowShape).startY = (initialState as RightArrowShape).startY + dy;
                    (shape as RightArrowShape).endX = (initialState as RightArrowShape).endX + dx;
                    (shape as RightArrowShape).endY = (initialState as RightArrowShape).endY + dy;
                    break;
                case TOOLS_NAME.PEN:
                    (shape as PenShape).lineArray = (initialState as PenShape).lineArray.map(([px, py]) => [px + dx, py + dy]);
                    break;
            }
        });
        this.updateSelectionBox();
    }

    /**
     * ✅ UPDATED: Resizes shapes based on the dragged handle, handling different shape properties.
     */
    private resizeShapes(dx: number, dy: number) {
        if (!this.selectionBox || !this.clickedResizeHandle || !this.initialShapesState.length) return;
    
        // Calculate the initial bounding box of the entire selection
        const initialBox = {
            x: Math.min(...this.initialShapesState.flatMap(s => this.getShapeBounds(s).allX)),
            y: Math.min(...this.initialShapesState.flatMap(s => this.getShapeBounds(s).allY)),
            maxX: 0, maxY: 0, width: 0, height: 0
        };
        initialBox.maxX = Math.max(...this.initialShapesState.flatMap(s => this.getShapeBounds(s).allX));
        initialBox.maxY = Math.max(...this.initialShapesState.flatMap(s => this.getShapeBounds(s).allY));
        initialBox.width = initialBox.maxX - initialBox.x;
        initialBox.height = initialBox.maxY - initialBox.y;

        const handle = this.clickedResizeHandle;
        const newWidth = handle.includes('left') ? initialBox.width - dx : initialBox.width + dx;
        const newHeight = handle.includes('top') ? initialBox.height - dy : initialBox.height + dy;

        let scaleX = initialBox.width > 1 ? newWidth / initialBox.width : 1;
        let scaleY = initialBox.height > 1 ? newHeight / initialBox.height : 1;
        if(handle === 'top' || handle === 'bottom') scaleX = 1;
        if(handle === 'left' || handle === 'right') scaleY = 1;
        
        const offsetX = handle.includes('left') ? dx : 0;
        const offsetY = handle.includes('top') ? dy : 0;

        // Apply transformation to each selected shape
        this.selectedShapes.forEach((shape, index) => {
            const initialState = this.initialShapesState[index]!;
            
            const transform = (ix: number, iy: number) => ({
                x: (ix - initialBox.x) * scaleX + initialBox.x + offsetX,
                y: (iy - initialBox.y) * scaleY + initialBox.y + offsetY,
            });

            switch (shape.type) {
                case TOOLS_NAME.RECT:
                case TOOLS_NAME.ECLIPSE:
                case TOOLS_NAME.DIAMOND: {
                    const iState = initialState as RectShape;
                    const { x, y } = transform(iState.x, iState.y);
                    (shape as RectShape).x = x;
                    (shape as RectShape).y = y;
                    (shape as RectShape).w = iState.w * scaleX;
                    (shape as RectShape).h = iState.h * scaleY;
                    break;
                }
                case TOOLS_NAME.LINE: {
                    const iState = initialState as LineShape;
                    const p1 = transform(iState.x1, iState.y1);
                    const p2 = transform(iState.x2, iState.y2);
                    (shape as LineShape).x1 = p1.x; (shape as LineShape).y1 = p1.y;
                    (shape as LineShape).x2 = p2.x; (shape as LineShape).y2 = p2.y;
                    break;
                }
                 case TOOLS_NAME.RIGHT_ARROW: {
                    const iState = initialState as RightArrowShape;
                    const p1 = transform(iState.startX, iState.startY);
                    const p2 = transform(iState.endX, iState.endY);
                    (shape as RightArrowShape).startX = p1.x; (shape as RightArrowShape).startY = p1.y;
                    (shape as RightArrowShape).endX = p2.x; (shape as RightArrowShape).endY = p2.y;
                    break;
                }
                case TOOLS_NAME.PEN: {
                    const iState = initialState as PenShape;
                    (shape as PenShape).lineArray = iState.lineArray.map(([px, py]) => {
                       const {x, y} = transform(px, py);
                       return [x, y];
                    });
                    break;
                }
            }
        });
        this.updateSelectionBox();
    }
    
    /** Helper to get numerical bounds for any shape. */
    private getShapeBounds(shape: Shape): { allX: number[], allY: number[] } {
        switch (shape.type) {
            case TOOLS_NAME.RECT:
            case TOOLS_NAME.ECLIPSE:
            case TOOLS_NAME.DIAMOND:
                const rectShape = shape as RectShape
                return { allX: [rectShape.x, rectShape.x + rectShape.w], allY: [rectShape.y, rectShape.y + rectShape.h] };
            case TOOLS_NAME.LINE:
                const lineShape = shape as LineShape
                return { allX: [lineShape.x1, lineShape.x2], allY: [lineShape.y1, lineShape.y2] };
            case TOOLS_NAME.RIGHT_ARROW:
                 return { allX: [(shape as RightArrowShape).startX, (shape as RightArrowShape).endX], allY: [(shape as RightArrowShape).startY, (shape as RightArrowShape).endY] };
            case TOOLS_NAME.PEN:
                return { allX: (shape as PenShape).lineArray.map(([px, _]) => px), allY: (shape as PenShape).lineArray.map(([_, py]) => py) };
            default:
                return { allX: [], allY: [] };
        }
    }
    
    private updateResizeHandles(): void { /* No changes */
        if (!this.selectionBox) return;
        const { x, y, width, height } = this.selectionBox;
        const handleSize = 10; const h = handleSize / 2;
        this.resizeHandles = [ { position: "topLeft", x: x - h, y: y - h, width: handleSize, height: handleSize }, { position: "topRight", x: x + width -h,y: y - h, width: handleSize, height: handleSize }, { position: "bottomLeft",  x: x - h, y: y + height -h,width: handleSize, height: handleSize }, { position: "bottomRight", x: x + width -h,y: y + height -h,width: handleSize, height: handleSize }, { position: 'top', x: x + width/2 -h, y: y - h, width: handleSize, height: handleSize }, { position: 'bottom', x: x + width/2-h, y: y + height -h,width: handleSize, height: handleSize }, { position: 'left', x: x - h, y: y + height/2 - h, width: handleSize, height: handleSize }, { position: 'right', x: x + width -h, y: y + height/2 - h,width: handleSize, height: handleSize }];
    }
    private getClickedResizeHandle(x: number, y: number): ResizeHandle | null { /* No changes */ return this.resizeHandles.find(handle => this.isPointInBox(x, y, handle)) || null; }
    private selectShapesInArea(allShapes: Shape[]): void { /* No changes */ if (!this.selectionArea) return; const {x1, y1, x2, y2} = this.selectionArea; const selMinX = Math.min(x1, x2), selMinY = Math.min(y1, y2), selMaxX = Math.max(x1, x2), selMaxY = Math.max(y1, y2); this.selectedShapes = allShapes.filter(shape => { const bounds = this.getShapeBounds(shape); const shapeMinX = Math.min(...bounds.allX), shapeMinY = Math.min(...bounds.allY), shapeMaxX = Math.max(...bounds.allX), shapeMaxY = Math.max(...bounds.allY); return shapeMinX < selMaxX && shapeMaxX > selMinX && shapeMinY < selMaxY && shapeMaxY > selMinY; }); this.updateSelectionBox();}
    private isPointInBox(px: number, py: number, box: { x: number, y: number, width: number, height: number }): boolean { /* No changes */ return px >= box.x && px <= box.x + box.width && py >= box.y && py <= box.y + box.height; }
}