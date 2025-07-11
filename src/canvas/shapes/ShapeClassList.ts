import type { DiamondShape, EclipseShape, LineShape, PenShape, RectShape, RightArrowShape, Shape } from "@/types/canvasTypes";
import { Ellipse } from "./Ellipse";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";
import { TOOLS_NAME } from "@/types/toolsTypes";
import { RightArrow } from "./Right_Arrow";
import { Diamond } from "./Diamond";
import { Pen } from "./Pen";
import { GeometricBehaviour } from "../InteractionBehaviour/geometricBehaviour";
import { PenBehavior } from "../InteractionBehaviour/penBehaviour";
import type { IInteractionBehavior } from "../InteractionBehaviour/baseclass";
import { SelectionBehavior } from "../InteractionBehaviour/selectionBehaviour";


export const InteractionBehaviourList = new Map<TOOLS_NAME, IInteractionBehavior>([
  [TOOLS_NAME.RECT, new GeometricBehaviour<RectShape>(new Rectangle() ) ],
  [TOOLS_NAME.ECLIPSE, new GeometricBehaviour<EclipseShape>(new Ellipse()) ],
  [TOOLS_NAME.LINE, new GeometricBehaviour<LineShape>(new Line() ) ],
  [TOOLS_NAME.RIGHT_ARROW, new GeometricBehaviour<RightArrowShape>(new RightArrow())],
  [TOOLS_NAME.DIAMOND,  new GeometricBehaviour<DiamondShape>(new Diamond())],
  [TOOLS_NAME.PEN, new PenBehavior(new Pen())],
  [TOOLS_NAME.MOUSE, new SelectionBehavior()]
]);