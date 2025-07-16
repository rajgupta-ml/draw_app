    import type { currentPositionType, Shape, TextShape } from "@/types/canvasTypes";
    import type { IShapeRenders } from "../shapes/baseClass";
    import type { BehaviorContext, IInteractionBehavior } from "./baseclass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

    export class TextBehaviour implements IInteractionBehavior{

        private input : null | HTMLInputElement = null
       
        private ctx: CanvasRenderingContext2D | null = null;
        private addShape: ((s: Shape) => void) | null = null;
        private requestRedraw: (() => void) | null = null;
        private finalized = false; 
        private isEditing : boolean = false;
        private shapeId : string | null = null;
        private textToEdit: TextShape | null = null;
        constructor(private shapeRender : IShapeRenders<TextShape>){}
        onMouseDown({ x, y, inputArea, ctx, requestRedraw, addShape, rawX, rawY, canvas, shapes, removeShape, config}: BehaviorContext): void {
            if (this.input === null) {
                let shape : Shape | null = null;
                for(let i = shapes.length - 1; i >= 0; i--){
                    console.log("I reach here")
                    shape = shapes[i]!
                    if(shape.type === TOOLS_NAME.TEXT && this.shapeRender.isPointInShape(shape as TextShape, x, y)){
                        canvas.style.cursor = "text";
                        this.isEditing = true;
                        this.shapeId = shape.id ?? null;
                        this.textToEdit = shape as TextShape;
                        break;
                    }
                }

                if(this.isEditing && this.shapeId){
                    removeShape(this.shapeId)
                    requestRedraw();
                    this.isEditing = false
                }

                this.ctx = ctx;
                this.addShape = addShape;
                this.requestRedraw = requestRedraw;
                
                this.input = this.createInputBox(x, y, rawX, rawY, canvas, config as TextOptionsPlusGeometricOptions);
                inputArea.appendChild(this.input);
                this.input.focus();
                this.input.select();
                window.dispatchEvent(new Event("input-created"));
                this.finalized = false;

            }
        }
        
        onMouseUp(context: BehaviorContext): void {
            
        }
        onMouseMove({shapes, canvas, x,y}: BehaviorContext): void {
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

        renderShapes({roughCanvas, ctx}: Pick<BehaviorContext, "roughCanvas" | "ctx">, shape: TextShape): void {
            this.shapeRender.render(shape, roughCanvas, ctx);
        }

        private createInputBox(x: number, y: number, rawX : number, rawY : number, canvas : HTMLCanvasElement, config : TextOptionsPlusGeometricOptions) {
            let screenX;
            let screenY
            let font_size;
            const input = document.createElement("input");

            const canvasRect = canvas.getBoundingClientRect();


            if(!this.textToEdit ){
                screenX  = rawX - canvasRect.left
                screenY  = rawY - canvasRect.top
                font_size = config.fontSize
            }else{
                screenX = (this.textToEdit.x).toString();
                screenY = (this.textToEdit.y).toString();
                font_size = `${this.textToEdit.config.font_size}px`
            }
            

            input.style.position = "absolute";
            input.style.top = `${screenY}px`;
            input.style.left =`${screenX}px`
            input.style.fontFamily = config.fontFamily
            input.style.fontSize = font_size
            input.style.color = this.textToEdit?.config.stroke||config.stroke!
            input.style.textAlign = config.textAlignment
            input.style.outline = "none";
            input.value = this.textToEdit?.text ?? "Add Text";
        
        
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    this.finalizeCreateInput(x,y, config);
                }
            });
        
            // input.addEventListener("blur", () => {
            //         this.finalizeCreateInput(x,y);
                
            // });
        
            return input;
        }

        private finalizeCreateInput = (x : number, y : number, config : TextOptionsPlusGeometricOptions) => {
            if (this.finalized || this.input === null) return;
            this.finalized = true;
        
            const text = this.input.value;
            const currentPosition: currentPositionType = {
                startX: this.textToEdit?.x ?? x,
                startY: this.textToEdit?.y ?? y,
                endX: 0,
                endY: 0
            };
            const shape = this.shapeRender.createShape(currentPosition);
            shape.text = text;
            
            const fontSize = this.textToEdit?.config.font_size || parseInt(config.fontSize).toString() || '16';
            const fontFamily = this.textToEdit?.config.font_family || config.fontFamily || 'Arial';
            const fontColor = this.textToEdit?.config.stroke || config.stroke!
            
            // Set the font on the context to match what will be rendered
            this.ctx!.font = `${fontSize}px ${fontFamily}`;
            
            // Now measure the text width with the correct font
            const textWidth = this.ctx!.measureText(text).width;
            shape.w = Math.floor(textWidth);
            
            // Also ensure the shape has the correct font properties
            shape.config.font_size = fontSize;
            shape.config.font_family = fontFamily;
            shape.config.stroke = fontColor;


            if(text){
                this.addShape!(shape);
            }

            this.input.remove(); 
            this.input = null;
            this.textToEdit = null; 
            this.requestRedraw!();
        };


        getShapeRenderer(): IShapeRenders<TextShape> {
            return this.shapeRender
        }


        
    }