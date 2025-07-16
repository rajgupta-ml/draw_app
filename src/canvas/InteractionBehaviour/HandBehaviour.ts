import type { BehaviorContext, IInteractionBehavior } from "./baseclass";

export class HandBehaviour implements IInteractionBehavior {
  private startX = 0;
  private startY = 0;

  private initialScrollX = 0;
  private initialScrollY = 0;

  private clicked = false;

  onMouseDown({ x, y, manager }: BehaviorContext): void {
    const { scrollPositionX, scrollPositionY } = manager;
    this.clicked = true;
    this.startX = x;
    this.startY = y;

    this.initialScrollX = scrollPositionX;
    this.initialScrollY = scrollPositionY;
  }

  onMouseMove({
    x,
    y,
    setScrollPositionX,
    setScrollPositionY,
    manager,
  }: BehaviorContext): void {
    if (this.clicked) {
      const dx = (x - this.startX) / 2;
      const dy = (y - this.startY) / 2;

      setScrollPositionX(this.initialScrollX - dx);
      setScrollPositionY(this.initialScrollY - dy);

      manager.drawCanvas(true);
    }
  }

  onMouseUp(): void {
    this.clicked = false;
  }
}
