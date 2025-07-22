import type { BehaviorContext, IInteractionBehavior } from "./baseclass";

export class HandBehaviour implements IInteractionBehavior {
  private startX = 0;
  private startY = 0;

  private initialScrollX = 0;
  private initialScrollY = 0;

  private clicked = false;
  private sessionId : string | null =null

  onMouseDown({ x, y, manager, collaborativeManager }: BehaviorContext): void {
    const { scrollPositionX, scrollPositionY } = manager;
    this.clicked = true;
    this.startX = x;
    this.startY = y;

    this.initialScrollX = scrollPositionX;
    this.initialScrollY = scrollPositionY;
    // this.sessionId = collaborativeManager.createSession(this)
  }

  onMouseMove({
    x,
    y,
    setScrollPositionX,
    setScrollPositionY,
    collaborativeManager,
    manager,
  }: BehaviorContext): void {
    if (this.clicked) {
      const dx = (x - this.startX) / 2;
      const dy = (y - this.startY) / 2;

      setScrollPositionX(this.initialScrollX - dx);
      setScrollPositionY(this.initialScrollY - dy);

      manager.drawCanvas(true);
      if(this.sessionId){
        // collaborativeManager.updateSession(this.sessionId,this)
      }

    }
  }

  onMouseUp({collaborativeManager} : BehaviorContext): void {
    this.clicked = false;
    if(this.sessionId){
      // collaborativeManager.updateSession(this.sessionId,this)
    }
  }

  updateState(state : unknown){
    if (isHandBehaviorState(state)) {
      this.startX = state.startX;
      this.startY = state.startY;
      this.initialScrollX = state.initialScrollX;
      this.initialScrollY = state.initialScrollY;
      this.clicked = state.clicked;
    } else {
      console.error("Received invalid state for HandBehaviour:", state);
    }
  }

  getState(): unknown {
    return {
      startX: this.startX,
      startY: this.startY,
      initialScrollX: this.initialScrollX,
      initialScrollY: this.initialScrollY,
      clicked: this.clicked,
    };
  }

  

  resetState(): void {
    this.startX = 0;
    this.startY = 0;
    this.initialScrollX = 0;
    this.initialScrollY = 0;
    this.clicked = false;
  }
}


interface IHandBehaviorState {
  startX: number;
  startY: number;
  initialScrollX: number;
  initialScrollY: number;
  clicked: boolean;
}


function isHandBehaviorState(state: unknown): state is IHandBehaviorState {
  // Cast to the target type to check properties.
  const s = state as IHandBehaviorState;
  return (
    s &&
    typeof s === "object" &&
    typeof s.startX === "number" &&
    typeof s.startY === "number" &&
    typeof s.initialScrollX === "number" &&
    typeof s.initialScrollY === "number" &&
    typeof s.clicked === "boolean"
  );
}

