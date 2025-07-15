import { useConfig } from "@/context/configContext";
import { useTheme } from "next-themes";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { strokeColor } from "./constant";
import { cn } from "@/lib/utils";
import { Copy, Trash } from "lucide-react";

export const StrokeColorLayout = () => {
    const { resolvedTheme } = useTheme(); 
    const { config, setConfig } = useConfig();
    const colorPickerRef = useRef<HTMLInputElement>(null); 

    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            setConfig(prevConfig => ({
                ...prevConfig,
                stroke: strokeColor[resolvedTheme][0]
            }));
        }
    }, [resolvedTheme, setConfig]); 

    const handleColorChange = (color: string) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            stroke: color 
        }));
    };

    return (
        <div className='flex flex-col gap-2'>
                <ConfigBarHeading>Stroke Color</ConfigBarHeading>
                <div className="flex gap-2 items-center">
                {(resolvedTheme === "light" || resolvedTheme === "dark") && strokeColor[resolvedTheme].map((color, index) => (
                    <div
                        onClick={() => handleColorChange(color)}
                        key={index}
                        className={cn(
                            "w-6 h-6 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 hover:scale-110 transition-all ease-in-out",
                            config.stroke === color ? `ring-1 ring-offset-1 ring-[${color}]` : "" 
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
                    className="w-7 h-7 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 hover:scale-110 transition-all ease-in-out"
                    title="Custom Color"
                />
            </div>
            <input
                type='color'
                className='hidden'
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
        <div className="flex flex-col gap-2 w-full ">
                <ConfigBarHeading>Actions</ConfigBarHeading>
                <div className='flex gap-2 w-full '>
                <button
                    className="cursor-pointer w-8 h-8 p-1 rounded-md flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                    title="Delete Selected Element"
                >
                    <Trash size={16} /> {/* Increased icon size for better visibility */}
                </button>
                <button
                    className="cursor-pointer w-8 h-8 p-1 rounded-md flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
                    title="Duplicate Selected Element"
                >
                    <Copy size={16} /> {/* Increased icon size */}
                </button>
            </div>
        </div>
    );
};

export const Button = ({children, className = "", altText } : {children : ReactNode, className? : string, altText : string}) => {


    return(
        <button
        title={altText}
        className={cn(
            "cursor-pointer w-8 h-8 rounded-md flex items-center justify-center border border-borde transition-colors",
            className
            )}>
            {children}
        </button>
    )
}

export const ConfigBarHeading = ({children} : {children : ReactNode}) => {

    return <h1 className='text-xs text-sidebar-foreground'>{children}</h1>

}