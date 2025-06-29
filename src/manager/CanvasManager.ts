import { RoughCanvas } from "roughjs/bin/canvas";

export type Tools = "rect" | "pencil" | "eclipse" | "hand" | "mouse" | "diamond" | "rightArrow" | "line" | "pen"
 
type RectShape = {
    type : "rect",
    x : number,
    y : number,
    w : number,
    h : number,
    config?: Record<string, string>
} 

type EclipseShape = {
    type : "eclipse",
    x : number,
    y : number,
    w : number,
    h : number,
    config?: Record<string, string> 
} 

type LineShape = {
    type : "line",
    x1 : number,
    y1 : number,
    x2 : number,
    y2 : number,
    config?: Record<string, string> 
}

export type Shape = RectShape | EclipseShape | LineShape;



export class CanvasManager {

    private canvas : HTMLCanvasElement
    private roughCanvas : RoughCanvas; 
    private ctx : CanvasRenderingContext2D
    private clicked : boolean = false;
    private scrollPositionX : number = 0;
    private scrollPositionY : number = 0;
    private shapes : Shape[] = [];
    private selectedTool : Tools
    private shapePositions = {
        startX : 0,
        startY : 0,
        endX : 0,
        endY : 0,
    }
    constructor(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D) {
        console.log("I am getting called")
        this.canvas = canvas;
        this.roughCanvas = new RoughCanvas(this.canvas);
        this.selectedTool = "rect",
        this.ctx = ctx;
    }

    // Add And Remove Event Listner
    addEventListners = () => {
        console.log("Added Even Listners");
        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mouseup",this.handleHouseUp)
        this.canvas.addEventListener("mousemove", this.handleHouseMove)
        this.canvas.addEventListener("wheel", this.handleScroll)

    }

    destroyEventListners = () => {
        console.log("Remvoved Event Listners");
        this.canvas.removeEventListener("mousedown", this.handleMouseDown )
        this.canvas.removeEventListener("mouseup", this.handleHouseUp )
        this.canvas.removeEventListener("mousemove", this.handleHouseMove)
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
        this.shapePositions = {
            ...this.shapePositions,
            startX :x,
            startY : y 
        }
    }


    private handleHouseMove = (e : MouseEvent) => {


        if(this.clicked){

            const {x,y } = this.getCoordinateAdjustedByScroll(e.clientX, e.clientY)
            this.shapePositions = {
                ...this.shapePositions,
                endX :x,
                endY :y  
            }
            this.drawCanvas({isScrolling : false})

        }
    }
    
    private handleHouseUp = (e : MouseEvent) => {
        this.clicked = false
        const shape = this.drawCanvas({isScrolling : false});
        if(shape){
            this.shapes.push(shape);
            console.log(this.shapes)
        }
    }
  

    private getCoordinateAdjustedByScroll = (coorX : number, coorY : number) : {x : number, y : number} => {

        const canvasRect = this.canvas.getBoundingClientRect();
        const x = coorX - canvasRect.left + this.scrollPositionX;
        const y = coorY - canvasRect.top + this.scrollPositionY;
    
        return {x,y}
    }

    drawCanvas = ({isScrolling} : {isScrolling : boolean}) : Shape | null  => {
    
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.scrollPositionX, -this.scrollPositionY);
        this.shapes.map((shape) => {
          this.RenderOrCreateShape(shape);
        }) 
        let newShape = null
        if(!isScrolling){
            newShape = this.RenderOrCreateShape();
        }

        this.ctx.restore();

        return newShape
    }

        // Updated RenderOrCreateShape
        private RenderOrCreateShape = (existingShape?: Shape) : Shape | null => { 
            const currentTool = this.getTool(); 
            const toolToRender = existingShape?.type ?? currentTool; 
        
            let newShape: Shape | null = null;
            
            switch (toolToRender) {
                case "rect": {
                    const x = existingShape && existingShape.type === "rect" ? existingShape.x : Math.min(this.shapePositions.startX, this.shapePositions.endX);
                    const y = existingShape && existingShape.type === "rect" ? existingShape.y : Math.min(this.shapePositions.startY, this.shapePositions.endY);
                    const w = existingShape && existingShape.type === "rect" ? existingShape.w : Math.abs(this.shapePositions.startX - this.shapePositions.endX);
                    const h = existingShape && existingShape.type === "rect" ? existingShape.h : Math.abs(this.shapePositions.startY - this.shapePositions.endY);
                
                    this.roughCanvas.rectangle(x, y, w, h);    
                    if (!existingShape) {
                        newShape = { type: "rect", x, y, w, h };
                    }
                    break;
                }
                case "eclipse": {
                    const x = existingShape && existingShape.type === "eclipse" ? existingShape.x : Math.min(this.shapePositions.startX, this.shapePositions.endX);
                    const y = existingShape && existingShape.type === "eclipse" ? existingShape.y : Math.min(this.shapePositions.startY, this.shapePositions.endY);
                    const w = existingShape && existingShape.type === "eclipse" ? existingShape.w : Math.abs(this.shapePositions.startX - this.shapePositions.endX);
                    const h = existingShape && existingShape.type === "eclipse" ? existingShape.h : Math.abs(this.shapePositions.startY - this.shapePositions.endY);
                    
                    this.roughCanvas.ellipse(x, y, w, h);
                    
                    if (!existingShape) {
                        newShape = { type: "eclipse", x, y, w, h };
                    }
                    break;
                }
                case "line": {
                
                    const x1 = existingShape && existingShape.type === "line" ? existingShape.x1 : this.shapePositions.startX;
                    const y1 = existingShape && existingShape.type === "line" ? existingShape.y1 : this.shapePositions.startY;
                    const x2 = existingShape && existingShape.type === "line" ? existingShape.x2 : this.shapePositions.endX;
                    const y2 = existingShape && existingShape.type === "line" ? existingShape.y2 : this.shapePositions.endY;
    
                    this.roughCanvas.line(x1, y1, x2, y2);
                    
                    if (!existingShape) {
                        newShape = { type: "line", x1, y1, x2, y2 };
                    }
                    break;
                }
               
                default:
               
                    break;
            }
    
            return newShape;
        }


    // Setter and Getter Methods
    setTool = (tool : Tools) => {
        this.selectedTool = tool;
        console.log(this.selectedTool);
    }

    getTool = () : Tools => {
        return this.selectedTool;
    }

    





}