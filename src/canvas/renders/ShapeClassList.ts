import type { Shape } from "@/types/canvasTypes";
import type { IShapeRenders } from "../baseClass";
import { Ellipse } from "./Ellipse";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RightArrow } from "./Right_Arrow";
import { Diamond } from "./Diamond";
import { Pen } from "./Pen";
import { DrawingBehavior } from "../drawingBehaviour/baseClass";
import { GeometricBehaviour } from "../drawingBehaviour/geometricBehaviour";
import { PenBehavior } from "../drawingBehaviour/penBehaviour";


export const DrawingBehaviorList = new Map<TOOLS_NAME, DrawingBehavior<Shape>>([
  [TOOLS_NAME.RECT, new GeometricBehaviour(new Rectangle() ) as DrawingBehavior<Shape>],
  [TOOLS_NAME.ECLIPSE, new GeometricBehaviour(new Ellipse()) as DrawingBehavior<Shape>],
  [TOOLS_NAME.LINE, new GeometricBehaviour(new Line() ) as DrawingBehavior<Shape>],
  [TOOLS_NAME.RIGHT_ARROW, new GeometricBehaviour(new RightArrow()) as DrawingBehavior<Shape>],
  [TOOLS_NAME.DIAMOND,  new GeometricBehaviour(new Diamond()) as DrawingBehavior<Shape>],
  [TOOLS_NAME.PEN, new PenBehavior(new Pen()) as DrawingBehavior<Shape>],
]);