import type { CanvasManager } from "@/manager/CanvasManager";
import { CommnadOperationId, type ICommand } from "./baseClass";
import type { Shape } from "@/types/canvasTypes";

export class AddShapeCommand implements ICommand {
    public operationNumber : number = 0;
    public operationId: CommnadOperationId;
    constructor (private manager : CanvasManager, private shape : Shape) {
        this.operationId = CommnadOperationId.ADD_SHAPE;
    }
    execute = () => {
        if (!this.shape.id) {
            this.shape.id = (this.operationNumber).toString();
        }

        this.manager.getShape().push(this.shape);
        this.manager.drawCanvas();
    };
    undo = () =>  {
        const index = this.manager.getShape().findIndex(s => s.id === this.shape.id);
        if(index !== -1){
            this.manager.getShape().splice(index,1);
            this.manager.drawCanvas();
        }
    };
}

export class RemoveShapeCommand implements ICommand {
    operationId: CommnadOperationId;
    operationNumber: number = 0;
    private shape : Shape;
    private originalIndex : number

    constructor (private manager : CanvasManager, shape : Shape, originalIndex: number) {
        this.operationId = CommnadOperationId.ADD_SHAPE;
        this.shape = structuredClone(shape);
        this.originalIndex = originalIndex;
    }
    execute = () => {
        const index = this.manager.getShape().findIndex(s => s.id === this.shape.id);
        if(index !== -1){
            this.manager.getShape().splice(index,1);
        }
        this.manager.drawCanvas(true);
    }
    undo = () => {
        this.manager.getShape().splice(this.originalIndex, 0, this.shape);
        this.manager.drawCanvas();
    }
}