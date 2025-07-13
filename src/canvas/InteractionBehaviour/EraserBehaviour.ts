import type { DiamondShape, LineShape, RectShape, RightArrowShape, Shape, TextShape } from "@/types/canvasTypes";
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

export class EraserBehaviour implements IInteractionBehavior{
    private clicked : boolean = false
    private ShapeWhichNeedsToBeRemoved : {shape : Shape, index : number}[]= [];
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

    onMouseDown(context: BehaviorContext): void {
        this.clicked = true;
    }

    onMouseUp({x,y,shapes , addRedoShape, requestRedraw}: BehaviorContext): void {
        let itemsRemoved = 0;
      
        this.clicked = false
        const seenIds = new Set();
        const shapesToBeRemovedFiltered = this.ShapeWhichNeedsToBeRemoved.filter((value) => {
            if(!seenIds.has(value.shape.id)){
                seenIds.add(value.shape.id)
                return true
            }else{
                return false
            }
        })

        shapesToBeRemovedFiltered.forEach((removedShape) => {

            addRedoShape(removedShape.shape);
            shapes.splice(removedShape.index - itemsRemoved, 1)
            itemsRemoved++;
        })
        requestRedraw();
    }

    
    onMouseMove({x, y, shapes, requestRedraw}: BehaviorContext): void {

        this.currentMouseX = x;
        this.currentMouseY = y;
        if(!this.clicked) {
            requestRedraw();
            return
        };
        shapes.forEach((shape, index) => {
            let newShape : Shape | null = null
            if(shape.type === TOOLS_NAME.TEXT){
                newShape = {...shape as TextShape, color:"gray"}
            }else{
                newShape = {...shape, config : eraserShapeConfig}
            }
            const shapeBehaviour = this.shapeBehaviours.get(shape.type);
            if(shapeBehaviour?.isPointInShape(shape, x,y)){
                this.ShapeWhichNeedsToBeRemoved.push({shape , index});
                shapes[index] = newShape
            }
        })

        requestRedraw();
    }


    previewShape(context: Pick<BehaviorContext, "roughCanvas">): void {
        const { roughCanvas } = context;
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