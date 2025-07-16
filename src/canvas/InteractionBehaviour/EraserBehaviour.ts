import type {  Shape } from "@/types/canvasTypes";
import type { BehaviorContext, IInteractionBehavior } from "./baseclass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { Rectangle } from "../shapes/Rectangle";
import { Pen } from "../shapes/Pen";
import type { IShapeRenders } from "../shapes/baseClass";
import { Diamond } from "../shapes/Diamond";
import { RightArrow } from "../shapes/Right_Arrow";
import { Line } from "../shapes/Line";
import { Ellipse } from "../shapes/Ellipse";
import { eraserShapeConfig, shapeConfig } from "@/constants/canvasConstant";
import { Text } from "../shapes/text";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
import { RemoveShapeCommand } from "../UndoAndRedoCmd/ShapeCommand";
import type { CanvasManager } from "@/manager/CanvasManager";

export class EraserBehaviour implements IInteractionBehavior{
    private clicked : boolean = false
    private shapesToMarkForRemoval : Map<string, {shape : Shape, index : number}> = new Map()
    private currentMouseX = 0;
    private currentMouseY = 0;
    private shapeBehaviours = new Map<TOOLS_NAME,IShapeRenders<Shape>>([
        [TOOLS_NAME.RECT, (new Rectangle())],
        [TOOLS_NAME.ECLIPSE, (new Ellipse())],
        [TOOLS_NAME.LINE, (new Line())],
        [TOOLS_NAME.RIGHT_ARROW, new RightArrow()],
        [TOOLS_NAME.DIAMOND, new Diamond()],
        [TOOLS_NAME.PEN, new Pen()],
        [TOOLS_NAME.TEXT, new Text()]
    ]);

    onMouseDown(): void {
        this.clicked = true;
        this.shapesToMarkForRemoval.clear();
    }

    onMouseUp({ executeCanvasCommnad, manager}: BehaviorContext): void { 
        const {drawCanvas} = manager
        this.clicked = false
        
        const sortedShapesToRemove = Array.from(this.shapesToMarkForRemoval.values()).sort((a, b) => b.index - a.index);

        sortedShapesToRemove.forEach(({shape, index}) => {
            executeCanvasCommnad(new RemoveShapeCommand(manager, shape, index));
        })
        this.shapesToMarkForRemoval.clear(); 
        drawCanvas();
    }

    
    onMouseMove({x, y, manager}: BehaviorContext): void {
        const shapesToUpdateForPreview: { index: number, newShape: Shape }[] = [];
        const {shapes, config, drawCanvas} = manager
        this.currentMouseX = x;
        this.currentMouseY = y;
        if(!this.clicked) {
            return
        };
        shapes.forEach((shape, index) => {
            const shapeBehaviour = this.shapeBehaviours.get(shape.type);
            
            if(shapeBehaviour?.isPointInShape(shape,x,y) && !this.shapesToMarkForRemoval.has(shape.id!)){
                this.shapesToMarkForRemoval.set(shape.id!, {shape: structuredClone(shape), index});
                let newShape:  Shape | null;
                if(config){
                    const newConfig : TextOptionsPlusGeometricOptions = {...config, ...eraserShapeConfig}
                    newShape = {
                        ...shape,
                        config : newConfig
                    }
    
                    if (newShape) {
                        shapesToUpdateForPreview.push({ index, newShape });
                    }
                }
            }
        })

        shapesToUpdateForPreview.forEach(({ index, newShape }) => {
            shapes[index] = newShape; 
        });

        drawCanvas();
    }


    previewShape(manager : CanvasManager): void {
        const { roughCanvas } = manager;
        // Draw your eraser cursor here
        const eraserSize = 20; // Adjust as needed
        const halfSize = eraserSize / 2;
    
        // You can draw a circle, a square, or even a more complex eraser icon
        roughCanvas.draw(
            roughCanvas.circle(this.currentMouseX, this.currentMouseY, halfSize, {
                roughness: 0,
                stroke: "white",
                strokeWidth: 1,
                fill: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
                fillStyle: "solid",
            })
        );

    }
    
}