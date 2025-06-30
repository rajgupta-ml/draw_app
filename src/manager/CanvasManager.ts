import { ShapeList } from "@/canvas/renders/ShapeClassList";
import type { Shape} from "@/types/canvasTypes";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RoughCanvas } from "roughjs/bin/canvas";

export type currentPositionType = {
    startX : number,
    startY : number,
    endX : number,
    endY : number,
}


export class CanvasManager {

    private canvas : HTMLCanvasElement;
    private availableDrawingShape = ShapeList;
    private roughCanvas : RoughCanvas; 
    private ctx : CanvasRenderingContext2D
    private clicked : boolean = false;
    private scrollPositionX : number = 0;
    private scrollPositionY : number = 0;
    private shapes : Shape[] = [];
    private selectedTool : TOOLS_NAME
    private dragged = false;
    private currentPosition = {
        startX : 0,
        startY : 0,
        endX : 0,
        endY : 0,
    }
    constructor(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.roughCanvas = new RoughCanvas(this.canvas);
        this.selectedTool = TOOLS_NAME.RECT,
        this.ctx = ctx;
    }

    // Add And Remove Event Listner
    addEventListeners = () => {
        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mouseup",this.handleMouseUp)
        this.canvas.addEventListener("mousemove", this.handleMouseMove)
        this.canvas.addEventListener("wheel", this.handleScroll)
    }

    destroyEventListeners = () => {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown )
        this.canvas.removeEventListener("mouseup", this.handleMouseUp )
        this.canvas.removeEventListener("mousemove", this.handleMouseMove)
        this.canvas.removeEventListener("wheel", this.handleScroll)

    }
    // Event Listner Functions
    private handleScroll = (e : WheelEvent) => {
        e.preventDefault();
        this.scrollPositionX += e.deltaX,
        this.scrollPositionY += e.deltaY,
        this.drawCanvas({isScrolling : true})
    }

    private handleMouseDown = (e : MouseEvent) => {
        this.clicked = true
        const {x,y} = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY)
        this.updateCurrentPosition(x, y)
    }


    private handleMouseMove = (e : MouseEvent) => {
        if(this.clicked){
            const {x,y } = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY)
            this.updateCurrentPosition(undefined, undefined, x,y)
            this.drawCanvas({isScrolling : false})
            this.dragged = true;

        }
    }
    
    private handleMouseUp = (e : MouseEvent) => {
        this.clicked = false
        if(this.dragged){
            this.drawCanvas({isScrolling : false});
            const newShape = this.availableDrawingShape.get(this.selectedTool)?.createShape(this.currentPosition)
            if(newShape){
                this.shapes.push(newShape);
            }
            this.dragged = false;
        }
        
    }
  
    private getCoordinateAdjustedByScroll = (coorX : number, coorY : number) : {x : number, y : number} => {

        const canvasRect = this.canvas.getBoundingClientRect();
        const x = coorX - canvasRect.left + this.scrollPositionX;
        const y = coorY - canvasRect.top + this.scrollPositionY;
    
        return {x,y}
    }

    private updateCurrentPosition(startX?: number, startY?: number, endX?: number, endY?: number) {
        this.currentPosition = {
            startX: startX ?? this.currentPosition.startX,
            startY: startY ?? this.currentPosition.startY,
            endX: endX ?? this.currentPosition.endX,
            endY: endY ?? this.currentPosition.endY,
        };
    }

    drawCanvas = ({isScrolling} : {isScrolling : boolean}) => {
        
        const currentToolStrategy = this.availableDrawingShape.get(this.selectedTool);
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.scrollPositionX, -this.scrollPositionY);
        this.shapes.map((shape) => {
          this.availableDrawingShape.get(shape.type)?.render(shape, this.roughCanvas)
        }) 
        if(!isScrolling && this.dragged && currentToolStrategy){
            const shape =currentToolStrategy.createShape(this.currentPosition);
            currentToolStrategy.render(shape, this.roughCanvas);
        } 
        this.ctx.restore();
        
    }


    // Setter and Getter Methods
    setTool = (tool : TOOLS_NAME) => {
        this.selectedTool = tool;
        console.log(this.selectedTool);
    }

    getTool = () : TOOLS_NAME => {
        return this.selectedTool;
    }

    





}