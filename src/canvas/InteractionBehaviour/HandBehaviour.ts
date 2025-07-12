import type { Shape } from "@/types/canvasTypes";
import type { BehaviorContext, IInteractionBehavior } from "./baseclass";

export class HandBehaviour implements IInteractionBehavior{ 
    private startX : number = 0;
    private startY : number = 0;

    private initialScrollX: number = 0;
    private initialScrollY: number = 0;

    private clicked : boolean = false;

    onMouseDown({x,y, getScrollPositionX, getScrollPositionY}: BehaviorContext): void {
        this.clicked = true;
        this.startX = x;
        this.startY = y;


        this.initialScrollX = getScrollPositionX();
        this.initialScrollY = getScrollPositionY(); 
    }
    
    onMouseMove({x,y, setScrollPositionX, setScrollPositionY, requestRedraw}: BehaviorContext): void {
        if(this.clicked){
            const dx = (x - this.startX) / 2;
            const dy = (y - this.startY) / 2;

            setScrollPositionX(this.initialScrollX - dx);
            setScrollPositionY(this.initialScrollY - dy);


            requestRedraw(true);
        }
    }

    onMouseUp({requestRedraw}: BehaviorContext): void {
        this.clicked = false;
    }

}