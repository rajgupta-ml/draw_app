import type { TOOLS_NAME } from "./toolsTypes";

interface IBase {
  id?: string;
  type: TOOLS_NAME;
  config?: Record<string, string>;
}

export type currentPositionType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
export interface RectShape extends IBase {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EclipseShape extends IBase {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LineShape extends IBase {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface RightArrowShape extends IBase {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface DiamondShape extends IBase {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PenArrayShape = [number, number];

export type PenShape = {
  type: TOOLS_NAME.PEN;
  lineArray: PenArrayShape[];
};
export type Shape =
  | RectShape
  | EclipseShape
  | LineShape
  | RightArrowShape
  | DiamondShape
  | PenShape;
