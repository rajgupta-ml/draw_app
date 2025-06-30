import type { TOOLS_NAME } from "./toolsTypes";

export type RectShape = {
  type: TOOLS_NAME.RECT;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: Record<string, string>;
};

export type EclipseShape = {
  type: TOOLS_NAME.ECLIPSE;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: Record<string, string>;
};

export type LineShape = {
  type: TOOLS_NAME.LINE;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  config?: Record<string, string>;
};

export type Shape = RectShape | EclipseShape | LineShape;
