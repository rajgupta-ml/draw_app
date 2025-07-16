export enum CommnadOperationId {
  ADD_SHAPE = "ADD_SHAPE",
  REMOVE_SHAPE = "REMOVE_SHAPE",
  UPDATE_SHAPE = "UPDATE_SHAPE",
}
export interface ICommand {
  operationId: CommnadOperationId;
  operationNumber: number;
  execute: () => void;
  undo: () => void;
}
