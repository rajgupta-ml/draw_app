import { TOOLS_NAME, type ITools } from "@/types/toolsTypes";
import {
  Hand,
  MousePointer2,
  RectangleHorizontal,
  Circle,
  DiamondIcon,
  MoveRight,
  LucideMoveHorizontal,
  Pen,
  Eraser,
  Type,
} from "lucide-react";

export const ToolComponent: ITools[] = [
  {
    name: TOOLS_NAME.HAND,
    Component: Hand,
    number: 0,
  },
  {
    name: TOOLS_NAME.MOUSE,
    Component: MousePointer2,
    number: 1,
  },
  {
    name: TOOLS_NAME.RECT,
    Component: RectangleHorizontal,
    number: 2,
  },
  {
    name: TOOLS_NAME.DIAMOND,
    Component: DiamondIcon,
    number: 3,
  },
  {
    name: TOOLS_NAME.ECLIPSE,
    Component: Circle,
    number: 4,
  },
  {
    name: TOOLS_NAME.RIGHT_ARROW,
    Component: MoveRight,
    number: 6,
  },
  {
    name: TOOLS_NAME.LINE,
    Component: LucideMoveHorizontal,
    number: 7,
  },
  {
    name: TOOLS_NAME.PEN,
    Component: Pen,
    number: 8,
  },
  {
    name: TOOLS_NAME.ERASER,
    Component: Eraser,
    number: 9,
  },
  {
    name: TOOLS_NAME.TEXT,
    Component: Type,
    number: 10,
  },
];
