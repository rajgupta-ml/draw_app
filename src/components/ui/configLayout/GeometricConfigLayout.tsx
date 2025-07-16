import { useConfig } from "@/context/useConfigContext";
import { useTheme } from "next-themes";
import { useLayoutEffect, useRef } from "react";
import { backgroundColor, strokeColor } from "./constant";
import { cn } from "@/lib/utils";
import type { Options } from "roughjs/bin/core";
import { ActionButtons, ConfigBarHeading, StrokeColorLayout } from "./common";


export const GeometricConfig = () => {
    const {resolvedTheme} = useTheme();
    const {config, handleConfigChange} = useConfig()
    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            handleConfigChange({...config, fill : backgroundColor[resolvedTheme][0]})
            handleConfigChange({...config, stroke : strokeColor[resolvedTheme][0]})

        }
    }, [resolvedTheme]);

    return (
        <>
            <StrokeColorLayout></StrokeColorLayout>
            <BackgroundColorLayout></BackgroundColorLayout>
            <StrokeWidthLayout />
            <StrokeStyleLayout />
            <FillLayout></FillLayout>
            <RoughnessSliderLayout />
            <ActionButtons />
        </>

    )
}




const BackgroundColorLayout = () => {
    const { resolvedTheme } = useTheme();
    const { config, handleConfigChange } = useConfig();
    const backgroundPickerRef = useRef<HTMLInputElement>(null);

    // Effect to update fill color when the theme changes.

    // Handler for changing background color.
    const handleBackgroundColorChange = (color: string) => {
        handleConfigChange({...config, fill : color})
    };

    return (
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Background Color</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {(resolvedTheme === "light" || resolvedTheme === "dark") && backgroundColor[resolvedTheme].map((color, index) => (
                    <div
                        onClick={() => handleBackgroundColorChange(color)}
                        key={index}
                        className={cn(
                            "w-6 h-6 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 hover:scale-110 transition-all ease-in-out flex items-center justify-center",
                            config.fill === color ? `ring-1 ring-offset-1 ring-[${color}]` : "" // Highlight selected color
                        )}
                        style={
                            color === "transparent" // Special styling for transparent background
                                ? {
                                    backgroundImage:
                                        "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                                    backgroundSize: "8px 8px",
                                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                                    backgroundColor: "#fff"
                                }
                                : { background: color }
                        }
                        title={color === "transparent" ? "Transparent" : color}
                    />
                ))}
                {/* Custom background color picker trigger */}
                <div
                    onClick={() => {
                        if (backgroundPickerRef.current) {
                            backgroundPickerRef.current.click();
                        }
                    }}
                    style={
                        config.fill === "transparent" // Special styling for transparent custom color
                            ? {
                                backgroundImage:
                                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                                backgroundSize: "8px 8px",
                                backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                                backgroundColor: "#fff"
                            }
                            : { background: config.fill }
                    }
                    className="w-7 h-7 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 hover:scale-110 transition-all ease-in-out"
                    title="Custom Background Color"
                />
            </div>
            {/* Hidden color input for custom background color selection */}
            <input
                type='color'
                className='hidden'
                ref={backgroundPickerRef}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                // HTML color input does not support "transparent", so provide a default solid color if fill is transparent
                value={config.fill !== "transparent" ? config.fill : "#000000"}
            />
        </div>
    );
};


const StrokeWidthLayout = () => {
    const { config, handleConfigChange } = useConfig(); // Get config and setConfig from context
    const widths = [1, 2, 3]; // Available stroke widths

    const handleWidthChange = (width: number) => {
        
        handleConfigChange({...config, strokeWidth : width})
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <ConfigBarHeading>Stroke Width</ConfigBarHeading>
            <div className="flex gap-3">
                {widths.map((width) => (
                    <button
                        key={width}
                        className={cn(
                            "cursor-pointer w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600 transition-colors",
                            config.strokeWidth === width ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => handleWidthChange(width)}
                        title={`Width ${width}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            {/* Line representing the stroke width */}
                            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth={width} strokeLinecap="round" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

const StrokeStyleLayout = () => {
    const { config, handleConfigChange } = useConfig(); 
    const styles = [
        { key: "solid", dash: [], label: "Solid" }, 
        { key: "dotted", dash: [2, 4], label: "Dotted" }, 
        { key: "dashed", dash: [8, 6], label: "Dashed" }, 
    ];

    // Handler for changing stroke style.
    const handleStyleChange = (styleKey: string, dashArray: number[]) => {
        handleConfigChange({...config, strokeLineDash : dashArray, strokeLineDashOffset : 0})

    };

    const currentStyleKey = styles.find(s =>
        JSON.stringify(s.dash) === JSON.stringify(config.strokeLineDash)
    )?.key || "solid"; 

    return (
        <div className="flex flex-col gap-2 w-full">
            <ConfigBarHeading>Stroke Style</ConfigBarHeading>
            <div className="flex gap-3">
                {styles.map((style) => (
                    <button
                        key={style.key}
                        className={cn(
                            "cursor-pointer w-8 h-8 rounded-md flex items-center justify-center border border-border transition-colors",
                            currentStyleKey === style.key ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => handleStyleChange(style.key, style.dash)}
                        title={style.label}
                    >
                        <svg className="w-full h-full" viewBox="0 0 32 32">
                            {/* Line representing the stroke style */}
                            <line
                                x1="6"
                                y1="16"
                                x2="26"
                                y2="16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                // Apply strokeDasharray if the dash array is not empty
                                {...(style.dash.length > 0 ? { strokeDasharray: style.dash.join(',') } : {})}
                            />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

const RoughnessSliderLayout = () => {
    const { config, handleConfigChange } = useConfig(); // Get config and setConfig from context

    const handleRoughnessChange = (value: number) => {
        const newRoughness = (value / 100) * 2;
        handleConfigChange({...config, roughness : newRoughness})
    };

    // Calculate the slider value from the current roughness for display.
    const displayValue = config.roughness !== undefined ? Math.round((config.roughness / 2) * 100) : 100;

    return (
        <div className="flex flex-col gap-2 w-full">
            <ConfigBarHeading>Roughness</ConfigBarHeading>
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={displayValue}
                    onChange={e => handleRoughnessChange(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg  cursor-pointer accent-sidebar-accent dark:accent-sidebar-accent-dark" // Styled slider
                />
                <span className="text-xs w-8 text-right text-gray-700 dark:text-gray-300">{displayValue}%</span>
            </div>
        </div>
    );
};

const FillLayout = () => {
    const { config, handleConfigChange } = useConfig(); 

    const handleFillStyleChange = (style: Options['fillStyle']) => {
        handleConfigChange(
            {...config, 
                fillStyle : style, 
                fill: (style !== 'none' && config.fill === 'transparent') ? config.stroke : config.fill
            })
    };

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-2'>
                <ConfigBarHeading>Fill Style</ConfigBarHeading>
                <div className='flex gap-3'>
                    <button
                        className={cn(
                            "cursor-pointer w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600 transition-colors",
                            config.fillStyle === "hachure" && config.fill !== "transparent" ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : "hover:bg-gray-100"
                        )}
                        onClick={() => handleFillStyleChange("hachure")}
                        title="Hachure Fill"
                    >
                        <div className='w-6 h-6'>
                            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z" stroke="currentColor" strokeWidth="1.25"></path>
                                <mask id="FillHachureIcon" maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                                    <path d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z" fill="currentColor" stroke="currentColor" strokeWidth="1.25"></path>
                                </mask>
                                <g mask="url(#FillHachureIcon)">
                                    <path d="M2.258 15.156 15.156 2.258M7.324 20.222 20.222 7.325m-20.444 5.35L12.675-.222m-8.157 18.34L17.416 5.22" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                </g>
                            </svg>
                        </div>
                    </button>

                    {/* Crosshatch Fill Style Button */}
                    <button
                        className={cn(
                            "cursor-pointer w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600 transition-colors",
                            config.fillStyle === "cross-hatch" && config.fill !== "transparent"? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => handleFillStyleChange("cross-hatch")}
                        title="Crosshatch Fill"
                    >
                        <div className='w-6 h-6'>
                            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <g clipPath="url(#a)">
                                    <path d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z" stroke="currentColor" strokeWidth="1.25"></path>
                                    <mask id="FillCrossHatchIcon" maskUnits="userSpaceOnUse" x="-1" y="-1" width="22" height="22">
                                        <path d="M2.426 15.044 15.044 2.426M7.383 20 20 7.383M0 12.617 12.617 0m-7.98 17.941L17.256 5.324m-2.211 12.25L2.426 4.956M20 12.617 7.383 0m5.234 20L0 7.383m17.941 7.98L5.324 2.745" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </mask>
                                    <g mask="url(#FillCrossHatchIcon)">
                                        <path d="M14.121 2H5.88A3.879 3.879 0 0 0 2 5.879v8.242A3.879 3.879 0 0 0 5.879 18h8.242A3.879 3.879 0 0 0 18 14.121V5.88A3.879 3.879 0 0 0 14.121 2Z" fill="currentColor"></path>
                                    </g>
                                </g>
                                <defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path>
                                </clipPath></defs></svg>
                        </div>
                    </button>

                    <button
                        className={cn(
                            "cursor-pointer w-8 h-8 rounded-md flex items-center justify-center border transition-colors",
                            config.fillStyle === "solid" && config.fill !== "transparent" ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => handleFillStyleChange("solid")}
                        title="Solid Fill"
                    >
                        <div className='w-6 h-6'>
                            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <g clipPath="url(#a)">
                                    <path d="M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z" stroke="currentColor" strokeWidth="1.25"></path>
                                </g>
                                <defs>
                                    <clipPath id="a">
                                        <path fill="#fff" d="M0 0h20v20H0z"></path>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </button>      
                </div>
            </div>
        </div>
    );
};
