import type { CanvasManager } from "@/manager/CanvasManager";
import { CommnadOperationId, type ICommand } from "./baseClass";
import type { Shape } from "@/types/canvasTypes";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

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


export class UpdateCommand implements ICommand {
    public operationNumber: number = 0; // Will be set by the CommandManager
    public operationId: CommnadOperationId;
    private shapeId: string;
    private oldConfig: TextOptionsPlusGeometricOptions;
    private newConfig: TextOptionsPlusGeometricOptions;

    constructor(
        private manager: CanvasManager,
        shape: Shape, 
        newConfig: TextOptionsPlusGeometricOptions
    ) {
        this.operationId = CommnadOperationId.UPDATE_SHAPE;
        this.shapeId = shape.id!;
        this.oldConfig = structuredClone(shape.config || {}); 
        this.newConfig = structuredClone(newConfig);
    }

    execute = (): void => {
        const shapeToUpdate = this.manager.getShape().find(s => s.id === this.shapeId);
        if (shapeToUpdate) {
            shapeToUpdate.config = this.newConfig;
            this.manager.drawCanvas();
        }
    };

    
    undo = (): void => {
        const shapeToUpdate = this.manager.getShape().find(s => s.id === this.shapeId);
        if (shapeToUpdate) {
            shapeToUpdate.config = this.oldConfig;
            this.manager.drawCanvas();
        }
    };
}