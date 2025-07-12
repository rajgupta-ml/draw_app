import type { DiamondShape, LineShape, RectShape, RightArrowShape, Shape } from "@/types/canvasTypes";
import type { BehaviorContext, IInteractionBehavior } from "./baseclass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { Rectangle } from "../shapes/Rectangle";
import { Pen } from "../shapes/Pen";
import type { IShapeRenders } from "../shapes/baseClass";
import { Diamond } from "../shapes/Diamond";
import { RightArrow } from "../shapes/Right_Arrow";
import { Line } from "../shapes/Line";
import { Ellipse } from "../shapes/Ellipse";
import { eraserShapeConfig } from "@/constants/canvasConstant";

export class EraserBehaviour implements IInteractionBehavior{
    private clicked : boolean = false
    private ShapeWhichNeedsToBeRemoved : {shape : Shape, index : number}[]= [];
    
    private shapeBehaviours = new Map<TOOLS_NAME,IShapeRenders<Shape>>([
        [TOOLS_NAME.RECT, (new Rectangle())],
        [TOOLS_NAME.ECLIPSE, (new Ellipse())],
        [TOOLS_NAME.LINE, (new Line())],
        [TOOLS_NAME.RIGHT_ARROW, new RightArrow()],
        [TOOLS_NAME.DIAMOND, new Diamond()],
        [TOOLS_NAME.PEN, new Pen()]
    ]);

    onMouseDown(context: BehaviorContext): void {
        this.clicked = true;
    }

    onMouseUp({shapes , addRedoShape, requestRedraw}: BehaviorContext): void {
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
        if(!this.clicked) return;
        
        shapes.forEach((shape, index) => {
            const newShape = {...shape, config : eraserShapeConfig}
            const shapeBehaviour = this.shapeBehaviours.get(shape.type);
            if(shapeBehaviour?.isPointInShape(shape, x,y)){
                this.ShapeWhichNeedsToBeRemoved.push({shape , index});
                shapes[index] = newShape
                requestRedraw();
            }
        })
    }
}