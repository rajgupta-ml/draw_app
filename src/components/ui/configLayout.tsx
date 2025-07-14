import { useTheme } from 'next-themes';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Separator } from './separator';
import { cn } from '@/lib/utils';
import { Copy, Trash } from 'lucide-react';

const strokeColor = {
  light: ["#000000", "#e03131", "#2f9e44", "#1971c2", "#f08c00"],
  dark: ["#ffffff", "#ff8381", "#369446", "#559BE0", "#B96200"]
};

const backgroundColor = {
    light: ["transparent", "#FFC9C9", "#B2F2BB", "#A6D8FF", "#FFEC99"],
    dark: ["transparent", "#5C2E2E", "#00390C", "#0F3F61", "#0F3F61"]
}

const ConfigLayout = () => {



  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2  min-w-[200px]">
      <div className="bg-sidebar shadow-accent-foreground shadow-2xl rounded-2xl h-full w-full p-4 flex flex-col gap-3">
        <StrokeColorLayout></StrokeColorLayout>
        <BackgroundColorLayout></BackgroundColorLayout>
        <StrokeWidthLayout />
        <StrokeStyleLayout />
        <FillLayout></FillLayout>
        <OpacitySliderLayout />
        <ActionButtons />
      </div>
    </div>
  );
};

export default ConfigLayout;



const StrokeColorLayout = () => {
    const { resolvedTheme } = useTheme();
    const [selectedStrokeColor, setSelectedStrokeColor] = useState(strokeColor.light[0]);
    const colorPickerRef = useRef<HTMLInputElement>(null)
    useLayoutEffect(() => {
      if (resolvedTheme === "light" || resolvedTheme === "dark") {
        setSelectedStrokeColor(strokeColor[resolvedTheme][0]);
      }
    }, [resolvedTheme]);

    return(
        <div className='flex flex-col gap-2'>
            <h1 className='text-xs'>Stroke </h1>
            <div className="flex gap-2 items-center">
            { (resolvedTheme === "light" || resolvedTheme === "dark") && strokeColor[resolvedTheme].map((color, index) => (
                <div
                onClick={() => setSelectedStrokeColor(color)}
                key={index}
                className={cn("w-6 h-6 rounded-md cursor-pointer hover:scale-110 transition-all ease-in-out", selectedStrokeColor === color ? `border-2 outline-[${color}]` : "")}
                style={{ background: color }}
                />
            ))}
            <div
                onClick={() => {
                    if(colorPickerRef.current){
                        colorPickerRef.current.click();
                    }
                }}
                style={{ background: selectedStrokeColor }}
                className="w-7 h-7 rounded-md cursor-pointer hover:scale-110 transition-all ease-in-out"
            />
            </div>
            <input type='color' className='hidden' ref = {colorPickerRef} onChange={(e) => setSelectedStrokeColor(e.target.value)}></input>
        </div>
    )
}

const BackgroundColorLayout = () => {
    const { resolvedTheme } = useTheme();
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(backgroundColor.light[0]);
    const backgroundPickerRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
          setSelectedBackgroundColor(backgroundColor[resolvedTheme][0]);
        }
      }, [resolvedTheme]);

    return(
        <div className='flex flex-col gap-2'>
            <h1 className='text-xs'>Background </h1>
            <div className="flex gap-2 items-center">
            { (resolvedTheme === "light" || resolvedTheme === "dark") && backgroundColor[resolvedTheme].map((color, index) => (
                <div
                onClick={() => setSelectedBackgroundColor(color)}
                key={index}
                className={cn(
                    "w-6 h-6 rounded-md cursor-pointer hover:scale-110 transition-all ease-in-out flex items-center justify-center",
                    selectedBackgroundColor === color ? `border-2 outline-[${color}]` : ""
                )}
                style={
                    color === "transparent"
                        ? {
                            backgroundImage:
                                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                            backgroundColor: "#fff"
                        }
                        : { background: color }
                }
                />
            ))}
            <div
                onClick={() => {
                    if(backgroundPickerRef.current){
                        backgroundPickerRef.current.click();
                    }
                }}
                style={
                    selectedBackgroundColor === "transparent"
                        ? {
                            backgroundImage:
                                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                            backgroundColor: "#fff"
                        }
                        : { background: selectedBackgroundColor }
                }
                className="w-7 h-7 rounded-md cursor-pointer hover:scale-110 transition-all ease-in-out"
            />
            </div>
            <input type='color' className='hidden' ref = {backgroundPickerRef} onChange={(e) => setSelectedBackgroundColor(e.target.value)}></input>
        </div>
    )
      
}

const StrokeWidthLayout = () => {
    const [selectedWidth, setSelectedWidth] = useState<number>(2);
    const widths = [1, 2, 3];
    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xs">Stroke Width</h1>
            <div className="flex gap-3">
                {widths.map((width, idx) => (
                    <button
                        key={width}
                        className={`cursor-pointer w-8 h-8 rounded-md flex items-center justify-center ${selectedWidth === width ? "bg-sidebar-accent text-sidebar-accent-foreground" : "border-1"}`}
                        onClick={() => setSelectedWidth(width)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth={width} strokeLinecap="round" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

const StrokeStyleLayout = () => {
    const [selectedStyle, setSelectedStyle] = useState<string>("solid");
    const styles = [
        { key: "solid", dash: "", label: "Solid" },
        { key: "dotted", dash: "4,4", label: "Dotted" },
        { key: "dashed", dash: "6,6", label: "Dashed" },
    ];
    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xs">Stroke Style</h1>
            <div className="flex gap-3">
                {styles.map((style) => (
                    <button
                        key={style.key}
                        className={`cursor-pointer w-8 h-8 rounded-md flex items-center justify-center ${selectedStyle === style.key ? "bg-sidebar-accent text-sidebar-accent-foreground" : "border-1"}`}
                        onClick={() => setSelectedStyle(style.key)}
                    >
                        <svg className="w-full h-full" viewBox="0 0 32 32">
                            <line
                                x1="6"
                                y1="16"
                                x2="26"
                                y2="16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                {...(style.dash ? { strokeDasharray: style.dash } : {})}
                            />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

const OpacitySliderLayout = () => {
    const [opacity, setOpacity] = useState<number>(100);
    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xs">Opacity</h1>
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={opacity}
                    onChange={e => setOpacity(Number(e.target.value))}
                    className="w-full accent-sidebar-accent"
                />
                <span className="text-xs w-8 text-right">{opacity}%</span>
            </div>
        </div>
    );
};

const FillLayout = () => {
    const [selectedFill, setSelectedFill] = useState<string>("hachure");
    return (
        <div className='w-full'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-xs'>Fill</h1>

                <div className='flex gap-3'>
                    <button
                        className={` cursor-pointer w-8 h-8 rounded-md flex items-center justify-center ${selectedFill === "hachure" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "border-1"}`}
                        onClick={() => setSelectedFill("hachure")}
                    >
                        <div className='w-6 h-6'>
                            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z" stroke="currentColor" strokeWidth="1.25"></path>
                                <mask id="FillHachureIcon"  maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                                    <path d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z" fill="currentColor" stroke="currentColor" strokeWidth="1.25"></path>
                                </mask>
                                <g mask="url(#FillHachureIcon)">
                                    <path d="M2.258 15.156 15.156 2.258M7.324 20.222 20.222 7.325m-20.444 5.35L12.675-.222m-8.157 18.34L17.416 5.22" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                </g>
                            </svg>
                        </div>
                    </button>

                    <button
                        className={`cursor-pointer w-8 h-8 rounded-md flex items-center justify-center ${selectedFill === "crosshatch" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "border-1 "}`}
                        onClick={() => setSelectedFill("crosshatch")}
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
                        className={`cursor-pointer w-8 h-8 rounded-md flex items-center justify-center ${selectedFill === "solid" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "border-1"}`}
                        onClick={() => setSelectedFill("solid")}
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
    )
}

// Action Buttons (Delete & Duplicate)
const ActionButtons = () => {
    return (
        <div className="flex flex-col gap-2 w-full ">
            
                <h1 className='text-sm'>Actions</h1>
                <div className='flex gap-2 w-full '>
                    <button className="cursor-pointer w-6 h-6 p-1 rounded-md flex items-center justify-center bg-destructive text-destructive-foreground transition-colors" title="Delete">
                        {/* Trash Icon */}
                        <Trash size={12}></Trash>
                    </button>
                    <button className="cursor-pointer w-6 h-6 p-1 rounded-md flex items-center justify-center bg-accent hover:bg-sidebar-accent transition-colors text-accent-foreground" title="Duplicate">
                        {/* Duplicate Icon */}
                        <Copy size={12}></Copy>
                    </button>
                </div>
            </div>
    );
};