import { useConfig } from "@/context/useConfigContext";
import { useTheme } from "next-themes";
import { useRef, type ReactNode } from "react";
import { strokeColor } from "./constant";
import { cn } from "@/lib/utils";
import { Copy, Trash } from "lucide-react";

export const StrokeColorLayout = () => {
  const { resolvedTheme } = useTheme();
  const { config, handleConfigChange } = useConfig();
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (color: string) => {
    handleConfigChange({ ...config, stroke: color });
  };

  return (
    <div className="flex flex-col gap-2">
      <ConfigBarHeading>Stroke Color</ConfigBarHeading>
      <div className="flex items-center gap-2">
        {(resolvedTheme === "light" || resolvedTheme === "dark") &&
          strokeColor[resolvedTheme].map((color, index) => (
            <div
              onClick={() => handleColorChange(color)}
              key={index}
              className={cn(
                "h-6 w-6 cursor-pointer rounded-md border border-gray-300 transition-all ease-in-out hover:scale-110 dark:border-gray-600",
                config.stroke === color
                  ? `ring-1 ring-offset-1 ring-[${color}]`
                  : "",
              )}
              style={{ background: color }}
              title={color}
            />
          ))}
        <div
          onClick={() => {
            if (colorPickerRef.current) {
              colorPickerRef.current.click();
            }
          }}
          style={{ background: config.stroke }}
          className="h-7 w-7 cursor-pointer rounded-md border border-gray-300 transition-all ease-in-out hover:scale-110 dark:border-gray-600"
          title="Custom Color"
        />
      </div>
      <input
        type="color"
        className="hidden"
        ref={colorPickerRef}
        onChange={(e) => handleColorChange(e.target.value)}
        value={config.stroke}
      />
    </div>
  );
};

// Action Buttons (Delete & Duplicate)
export const ActionButtons = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <ConfigBarHeading>Actions</ConfigBarHeading>
      <div className="flex w-full gap-2">
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
          title="Delete Selected Element"
        >
          <Trash size={16} /> {/* Increased icon size for better visibility */}
        </button>
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-blue-500 p-1 text-white shadow-md transition-colors hover:bg-blue-600"
          title="Duplicate Selected Element"
        >
          <Copy size={16} /> {/* Increased icon size */}
        </button>
      </div>
    </div>
  );
};

export const Button = ({
  children,
  className = "",
  altText,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  altText: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      title={altText}
      className={cn(
        "border-border flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
};

export const ConfigBarHeading = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-sidebar-foreground text-xs">{children}</h1>;
};
