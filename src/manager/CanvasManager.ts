export class CanvasManager {

    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D
    private clicked : boolean = false;
    private scrollPositionX : number = 0;
    private scrollPositionY : number = 0;
    constructor(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    addEventListners = () => {
        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mouseup",this.handleHouseUp)
        this.canvas.addEventListener("mousemove", this.handleHouseMove)
        this.canvas.addEventListener("wheel", this.handleScroll)

    }


    destroyEventListners = () => {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown )
        this.canvas.removeEventListener("mouseup", this.handleHouseUp )
        this.canvas.removeEventListener("mousemove", this.handleHouseMove)
        this.canvas.removeEventListener("wheel", this.handleScroll)

    }


    drawCanvas = () => {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "blue",
        this.ctx.fillRect(10 - this.scrollPositionX / 2 , 10 - this.scrollPositionY  / 2 , 50, 50); // Draw a rectangle that moves vertically    
    }


    private handleScroll = (e : WheelEvent) => {
        e.preventDefault();
        this.scrollPositionX += e.deltaX,
        this.scrollPositionY += e.deltaY,
        this.drawCanvas()
    }

    private handleMouseDown = (e : MouseEvent) => {
        this.clicked = true
        console.log("Mouse Down: ",{x : e.clientX, y : e.clientY})
    }

    private handleHouseUp = (e : MouseEvent) => {
        this.clicked = false
        console.log("Mouse Up :", {x : e.clientX, y : e.clientY})
    }
  
    private handleHouseMove = (e : MouseEvent) => {
        if(this.clicked){
          console.log("Mouse Move :", {x : e.clientX, y : e.clientY})
        }
    }


    





}