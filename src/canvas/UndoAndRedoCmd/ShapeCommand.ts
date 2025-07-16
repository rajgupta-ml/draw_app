import type { CanvasManager } from "@/manager/CanvasManager";
import { CommnadOperationId, type ICommand } from "./baseClass";
import type { Shape } from "@/types/canvasTypes";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";

export class AddShapeCommand implements ICommand {
  public operationNumber = 0;
  public operationId: CommnadOperationId;
  constructor(
    private manager: CanvasManager,
    private shape: Shape,
  ) {
    this.operationId = CommnadOperationId.ADD_SHAPE;
  }
  execute = () => {
    this.shape.id ??= this.operationNumber.toString();
    this.manager.shapes.push(this.shape);
    this.manager.drawCanvas();
  };
  undo = () => {
    const index = this.manager.shapes.findIndex((s) => s.id === this.shape.id);
    if (index !== -1) {
      this.manager.shapes.splice(index, 1);
      this.manager.drawCanvas();
    }
  };
}

export class RemoveShapeCommand implements ICommand {
  operationId: CommnadOperationId;
  operationNumber = 0;
  private shape: Shape;
  private originalIndex: number;

  constructor(
    private manager: CanvasManager,
    shape: Shape,
    originalIndex: number,
  ) {
    this.operationId = CommnadOperationId.ADD_SHAPE;
    this.shape = structuredClone(shape);
    this.originalIndex = originalIndex;
  }
  execute = () => {
    const index = this.manager.shapes.findIndex((s) => s.id === this.shape.id);
    if (index !== -1) {
      this.manager.shapes.splice(index, 1);
    }
    this.manager.drawCanvas(true);
  };
  undo = () => {
    this.manager.shapes.splice(this.originalIndex, 0, this.shape);
    this.manager.drawCanvas();
  };
}

export class UpdateCommand implements ICommand {
  public operationNumber = 0; // Will be set by the CommandManager
  public operationId: CommnadOperationId;
  private shapeId: string;
  private oldConfig: TextOptionsPlusGeometricOptions;
  private newConfig: TextOptionsPlusGeometricOptions;

  constructor(
    private manager: CanvasManager,
    shape: Shape,
    newConfig: TextOptionsPlusGeometricOptions,
  ) {
    this.operationId = CommnadOperationId.UPDATE_SHAPE;
    this.shapeId = shape.id!;
    this.oldConfig = structuredClone(shape.config || {});
    this.newConfig = structuredClone(newConfig);
  }

  execute = (): void => {
    const shapeToUpdate = this.manager.shapes.find(
      (s) => s.id === this.shapeId,
    );
    if (shapeToUpdate) {
      shapeToUpdate.config = this.newConfig;
      this.manager.drawCanvas();
    }
  };

  undo = (): void => {
    const shapeToUpdate = this.manager.shapes.find(
      (s) => s.id === this.shapeId,
    );
    if (shapeToUpdate) {
      shapeToUpdate.config = this.oldConfig;
      this.manager.drawCanvas();
    }
  };
}
