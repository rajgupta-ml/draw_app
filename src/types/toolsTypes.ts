import type { LucideIcon } from "lucide-react";

export interface ITools {
  name: TOOLS_NAME;
  Component: LucideIcon;
  number: number;
}

export enum TOOLS_NAME {
  RECT = "rect",
  PENCIL = "pencil",
  ECLIPSE = "ellipse",
  HAND = "hand",
  MOUSE = "mouse",
  DIAMOND = "diamond",
  RIGHT_ARROW = "rightArrow",
  LINE = "line",
  PEN = "pen",
}
