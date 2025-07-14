import { ToolComponent } from "@/constants/toolbarConstant";
import { cn } from "@/lib/utils";
import type { TOOLS_NAME } from "@/types/toolsTypes";
import React, { useState } from "react";

interface IToolbar {
  setTool: ((tool: TOOLS_NAME) => void) ;
  getTool: (() => TOOLS_NAME);
}
const Toolbar = ({ setTool, getTool }: IToolbar) => {
  const [state, setState] = useState<TOOLS_NAME>();
  console.log(state);
  const handleClick = (name: TOOLS_NAME) => {
      setTool(name);
      setState(name);    
  };
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2">
      <div className="border-border bg-muted flex w-xs items-center justify-between rounded-md p-1">
        {ToolComponent.map(({ name, Component }, index) => {
          return (
            <div
              onClick={() => handleClick(name)}
              key={index}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground text-muted-foreground flex cursor-pointer items-end gap-1 rounded-md p-2 transition-all duration-300",
                getTool && getTool() == name
                  ? "bg-accent text-accent-foreground "
                  : "",
              )}
            >
              <Component size={14}></Component>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbar;
