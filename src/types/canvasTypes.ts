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

export interface PenShape extends IBase {
  type: TOOLS_NAME.PEN;
  lineArray: PenArrayShape[];
};


export interface TextShape extends IBase {
  type : TOOLS_NAME.TEXT,
  x : number;
  y : number;
  w : number;
  text : string,
  config : {
    "font_size" : string;
    "font_weight" : string;
    "font_family" : string;
    "stroke" : string;
  }
}
export type Shape =
  | RectShape
  | EclipseShape
  | LineShape
  | RightArrowShape
  | DiamondShape
  | PenShape
  | TextShape;
