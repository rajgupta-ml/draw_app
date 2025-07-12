import type { Shape } from "@/types/canvasTypes";
import type { BehaviorContext, IInteractionBehavior } from "./baseclass";

export class EraserBehaviour implements IInteractionBehavior{
    onMouseDown(context: BehaviorContext): void {
        
    }

    onMouseUp(context: BehaviorContext): void {
        
    }

    onMouseMove(context: BehaviorContext): void {
        
    }

    previewShape(context: Pick<BehaviorContext, "roughCanvas">): void {
        
    }

    renderShapes(context: Pick<BehaviorContext, "roughCanvas">, shape: Shape): void {
        
    }
}