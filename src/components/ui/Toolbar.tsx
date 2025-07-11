import { ToolComponent } from "@/constants/toolbarConstant";
import { cn } from "@/lib/utils";
import type { TOOLS_NAME } from "@/types/toolsTypes";
import React, { useState } from "react";

interface IToolbar {
  setTool: ((tool: TOOLS_NAME) => void) | undefined;
  getTool: (() => TOOLS_NAME) | undefined;
}
const Toolbar = ({ setTool, getTool }: IToolbar) => {
  const [state, setState] = useState<TOOLS_NAME>();
  console.log(state);
  const handleClick = (name: TOOLS_NAME) => {
    if (setTool && getTool) {
      setTool(name);
      setState(name);
    }
  };
  return (
    <div className="items-center fixed top-5 right-0 left-0 flex h-12 justify-center p-0">
      <div className="border-border bg-muted flex w-md items-center justify-between rounded-md p-1">
        {ToolComponent.map(({ name, Component }, index) => {
          return (
            <div
              onClick={() => handleClick(name)}
              key={index}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground text-muted-foreground flex cursor-pointer items-end gap-1 rounded-md p-2 transition-all duration-300",
                getTool && getTool() == name
                  ? "bg-accent text-accent-foreground"
                  : "",
              )}
            >
              <Component></Component>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbar;
