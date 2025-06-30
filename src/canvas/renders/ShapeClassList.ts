import type { Shape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../baseClass";
import { Ellipse } from "./Ellipse";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";
import { TOOLS_NAME } from "@/types/toolsTypes";

export const ShapeList = new Map<TOOLS_NAME, IShapeRenders<Shape>>([
    [TOOLS_NAME.RECT, new Rectangle() as IShapeRenders<Shape>],
    [TOOLS_NAME.ECLIPSE, new Ellipse() as IShapeRenders<Shape>],
    [TOOLS_NAME.LINE, new Line() as IShapeRenders<Shape>],
]);
