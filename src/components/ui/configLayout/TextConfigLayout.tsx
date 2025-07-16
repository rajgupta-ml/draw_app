import { useTheme } from "next-themes";
import { Button, ConfigBarHeading, StrokeColorLayout } from "./common";
import { useConfig } from "@/context/useConfigContext";
import { AlignCenter, AlignLeft, AlignRight, Code, Pen } from "lucide-react";
import { Alphabet } from "../Icon/Alphabet";
import { useLayoutEffect, useState } from "react";
import { strokeColor } from "./constant";


export const TextConfig = () => {
    const {handleConfigChange, config} = useConfig();
    const {resolvedTheme} = useTheme(); 
    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            handleConfigChange({...config, fill: strokeColor[resolvedTheme][0]})
            handleConfigChange({...config, stroke : strokeColor[resolvedTheme][0]})

        }
    }, [resolvedTheme]);

    return (
        <>
            <StrokeColorLayout></StrokeColorLayout>
            <FontFamily></FontFamily>
            <FontSize></FontSize>
            <TextAlign></TextAlign>
        </>
    )
}
type FontType = "Arial" | "Poppins" | "Source Code Pro"
const FontFamily = () => {
    const { config , handleConfigChange } = useConfig();
    const buttons = [
        {
            component : <Pen size = {12}/>,
            altText : "Hand-draw",
            fontFamily: "Arial"
        },
        {
            component : <Alphabet size = {12}/>,
            altText : "Normal",
            fontFamily: "Poppins"
        },
        {
            component : <Code size = {12}/>,
            altText : "code",
            fontFamily: "Source Code Pro",
        }
    ]

    const handleFontChange = (data : FontType) => {
        
        handleConfigChange({...config, fontFamily: data})

    }
    return(
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Font Family</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {buttons.map((data) => {
                    const Component = data.component
                    return (
                        <Button 
                        className=
                        {`${config.fontFamily === data.fontFamily ? 
                            "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : 
                            "hover:bg-accent hover:text-accent-foreground"} `} 
                        altText={data.altText} 
                        key = {data.fontFamily} 
                        onClick={() => handleFontChange((data.fontFamily as FontType))}
>
                            {Component}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
type FontSizeType = "12px" | "16px" | "24px" | "32px"
const FontSize = () => {
    const {config, handleConfigChange } = useConfig();
    const handleFontSizeChange = (data : FontSizeType) => {
        handleConfigChange({...config, fontSize : data})
    }
    const buttons = [
        {
            component : "S",
            altText : "small",
            fontSize: "12px"
        },
        {
            component : "M",
            altText : "Medium",
            fontSize : "16px"
        },
        {
            component : "L",
            altText : "large",
            fontSize : "24px",
        },
        {
            component : "XL",
            altText : "extra large",
            fontSize : "32px",
        }
        ]

    return(
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Font Size</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {buttons.map((data) => {
                    const Component = data.component
                    return (
                        <Button 
                        onClick={() => handleFontSizeChange((data.fontSize as FontSizeType))}
                        className=
                        {`${data.fontSize === config.fontSize ? 
                            "bg-sidebar-accent text-sidebar-accent-foreground shadow-md text-xs" : 
                            "hover:bg-accent hover:text-accent-foreground text-xs"} `} 
                        
                        altText = {data.altText} key = {data.fontSize}>
                            {Component}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
type TextAlignType = "left" | "center" | "right"
const TextAlign = () => {
    const {config, handleConfigChange } = useConfig();

    const handleTextAlign = (data : TextAlignType) => {
        handleConfigChange({...config, textAlignment: data})

    }

    const buttons = [
        {
            component : AlignLeft,
            altText : "align-left",
            align: "left"
        },
        {
            component : AlignCenter,
            altText : "align center",
            align : "center",
        },
        {
            component : AlignRight,
            altText : "align-right",
            align : "right"
        },
        
        ]

    return(
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Text Align</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {buttons.map((data) => {
                    const Component = data.component
                    return (
                        <Button 
                        className={`${data.align === config.textAlignment ? 
                            "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : 
                            "hover:bg-accent hover:text-accent-foreground"} `} 
                        
                        altText = {data.altText} 
                        key = {data.align}
                        onClick={() => handleTextAlign(data.align as TextAlignType)}
                        >
                            {<Component size = {12}/>}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}