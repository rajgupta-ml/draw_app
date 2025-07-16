    import type { currentPositionType, Shape, TextShape } from "@/types/canvasTypes";
    import type { IShapeRenders } from "../shapes/baseClass";
    import type { BehaviorContext, IInteractionBehavior } from "./baseclass";
    import { TOOLS_NAME } from "@/types/toolsTypes";
    import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
    import type { ICommand } from "../UndoAndRedoCmd/baseClass";
    import { AddShapeCommand, RemoveShapeCommand } from "../UndoAndRedoCmd/ShapeCommand";
    import type { CanvasManager } from "@/manager/CanvasManager";

    export class TextBehaviour implements IInteractionBehavior{

        private input : null | HTMLInputElement = null
        private finalized = false; 
        private isEditing : boolean = false;
        private textToEdit: TextShape | null = null;
        constructor(private shapeRender : IShapeRenders<TextShape>){}
        onMouseDown({ x, y, executeCanvasCommnad, rawX, rawY, manager}: BehaviorContext): void {
            const {shapes, canvas, drawCanvas, inputArea} = manager
            if (this.input === null) {
                let shape : Shape | null = null;
                let originalIndex = 0;
                for(let i = shapes.length - 1; i >= 0; i--){
                    shape = shapes[i]!
                    if(shape.type === TOOLS_NAME.TEXT && this.shapeRender.isPointInShape(shape as TextShape, x, y)){
                        canvas.style.cursor = "text";
                        this.isEditing = true;
                        this.textToEdit = shape as TextShape;
                        originalIndex = i;
                        break;
                    }
                }

                if(this.isEditing && shape){
                    executeCanvasCommnad(new RemoveShapeCommand(manager, shape, originalIndex))
                    drawCanvas();
                    this.isEditing = false
                }

                
                this.input = this.createInputBox(x, y, rawX, rawY, manager, executeCanvasCommnad);
                inputArea.appendChild(this.input);
                this.input.focus();
                this.input.select();
                window.dispatchEvent(new Event("input-created"));
                this.finalized = false;

            }
        }
        
        onMouseUp(context: BehaviorContext): void {
            
        }
        onMouseMove({x,y, manager}: BehaviorContext): void {
            const {shapes, canvas } = manager
            for(let i = shapes.length - 1; i >= 0; i--){
                const shape = shapes[i]!
                if(shape.type === TOOLS_NAME.TEXT && this.shapeRender.isPointInShape(shape as TextShape, x, y)){
                    canvas.style.cursor = "text";
                    break;
                }else{
                    canvas.style.cursor = "crosshair"
                }
            }

        }

        renderShapes(manager : CanvasManager, shape: TextShape): void {
            const {roughCanvas, offScreenCanvasctx} = manager
            this.shapeRender.render(shape, roughCanvas, offScreenCanvasctx);
        }

        private createInputBox(
            x: number, 
            y: number, 
            rawX : number, 
            rawY : number, 
            manager : CanvasManager,
            executeCanvasCommnad : (cmd : ICommand) => void
        ) {
            let screenX;
            let screenY
            let font_size;
            let font_family
            let stroke;
            const {canvas, config} = manager 
            const input = document.createElement("input");

            const canvasRect = canvas.getBoundingClientRect();


            if(!this.textToEdit){
                screenX  = rawX - canvasRect.left
                screenY  = rawY - canvasRect.top
                font_size = config!.fontSize
                font_family = config!.fontFamily
                stroke = config!.stroke
            }else{
                screenX = (this.textToEdit.x).toString();
                screenY = (this.textToEdit.y).toString();
                font_size = `${this.textToEdit.config.fontSize}px`
                font_family = this.textToEdit.config.fontFamily
                stroke = this.textToEdit.config.stroke
            }
            

            input.style.position = "absolute";
            input.style.top = `${screenY}px`;
            input.style.left =`${screenX}px`
            input.style.fontFamily = font_family
            input.style.fontSize = font_size
            input.style.color = stroke!
            input.style.textAlign = config!.textAlignment
            input.style.outline = "none";
            input.value = this.textToEdit?.text ?? "Add Text";
        
        
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    this.finalizeCreateInput(x,y, config!, manager, executeCanvasCommnad);
                }
            });
        
            // input.addEventListener("blur", () => {
            //         this.finalizeCreateInput(x,y);
                
            // });
        
            return input;
        }

        private finalizeCreateInput = (
            x : number, 
            y : number,
            config : TextOptionsPlusGeometricOptions, 
            manager : CanvasManager,
            executeCanvasCommnad : (cmd : ICommand) => void
        ) => {
            if (this.finalized || this.input === null) return;
            this.finalized = true;

            const {ctx, drawCanvas} = manager
        
            const text = this.input.value;
            const currentPosition: currentPositionType = {
                startX: this.textToEdit?.x ?? x,
                startY: this.textToEdit?.y ?? y,
                endX: 0,
                endY: 0
            };
            const shape = this.shapeRender.createShape(currentPosition);
            shape.text = text;
            
            const fontSize = this.textToEdit?.config.fontSize || parseInt(config.fontSize).toString() || '16';
            const fontFamily = this.textToEdit?.config.fontFamily || config.fontFamily || 'Arial';
            const fontColor = this.textToEdit?.config.stroke || config.stroke!
            
            // Set the font on the context to match what will be rendered
            ctx.font = `${fontSize}px ${fontFamily}`;
            
            // Now measure the text width with the correct font
            const textWidth = ctx.measureText(text).width;
            shape.w = Math.floor(textWidth);
            
            // Also ensure the shape has the correct font properties
            shape.config.fontSize = fontSize;
            shape.config.fontFamily = fontFamily;
            shape.config.stroke = fontColor;


            if(text){
                executeCanvasCommnad(new AddShapeCommand(manager, shape));
            }

            this.input.remove(); 
            this.input = null;
            this.textToEdit = null; 
            drawCanvas();
        };


        getShapeRenderer(): IShapeRenders<TextShape> {
            return this.shapeRender
        }


        
    }