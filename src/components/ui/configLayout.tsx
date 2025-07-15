"use clients"
import { useTheme } from 'next-themes';
import React, { useState, useRef, useLayoutEffect, useContext, useEffect } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Code, Pen} from 'lucide-react';
import { useConfig } from '@/context/configContext';
import { Button, ConfigBarHeading, StrokeColorLayout } from './configLayout/common';
import { strokeColor } from './configLayout/constant';
import { Alphabet } from './Icon/Alphabet';


const ConfigLayout = () => {
    const {config} = useConfig();
    const latestConfig = useRef(config);
    const [showSideBar, setShowSidebar] = useState(true);
    useEffect(() => {
        latestConfig.current = config;
    }, [config]);


    if(typeof window === undefined) return;

    useEffect(() => {
        window.addEventListener("fetch-config", handleFetchConfig)
        window.addEventListener("hide-sidebar", hideShowBar) 
        window.addEventListener("show-sidebar", showBar) 

        return () => {
            window.removeEventListener("fetch-config", handleFetchConfig)
            window.removeEventListener("hide-sidebar", hideShowBar) 
            window.addEventListener("show-sidebar", showBar) 
        }

    },[])

    const hideShowBar =() => {
        setShowSidebar(false);
    }

    const showBar =() => {
        setShowSidebar(true);
    }
    const handleFetchConfig = () => {
        window.dispatchEvent(new CustomEvent("get-config-data", {detail : {config : latestConfig.current}}))
    }

  return (
    <>
        {(showSideBar) ? (
            <div className="absolute left-5 top-1/2 -translate-y-1/2  min-w-[200px]">
                <div className="bg-sidebar shadow-accent-foreground shadow-2xl rounded-2xl h-full w-full p-4 flex flex-col gap-3">
                    {/* <GeometricConfig></GeometricConfig> */}
                    <TextConfig></TextConfig>
                </div> 
            </div>
        ) : (<></>)}
    </>
    );
};

export default ConfigLayout;



const TextConfig = () => {
    return (
        <>
            <StrokeColorLayout></StrokeColorLayout>
            <FontFamily></FontFamily>
            <FontSize></FontSize>
            <TextAlign></TextAlign>
        </>
    )
}

const FontFamily = () => {
    const {resolvedTheme} = useTheme();
    const {config, setConfig } = useConfig();

    const buttons = [
        {
            component : <Pen size = {12}/>,
            altText : "Hand-draw",
            fontFamily: "Arial"
        },
        {
            component : <Alphabet size = {12}/>,
            altText : "Normal",
            FontFamily : "Poppins"
        },
        {
            component : <Code size = {12}/>,
            altText : "code",
            FontFamily : "Arial",
        }
        ]
    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            // Set fill to the first color of the new theme's palette
            setConfig(prevConfig => ({
                ...prevConfig,
                fill: strokeColor[resolvedTheme][0]
            }));
        }
    }, [resolvedTheme, setConfig]);

    return(
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Font Family</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {buttons.map((data) => {
                    const Component = data.component
                    return (
                        <Button altText={data.altText} key = {data.altText}>
                            {Component}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}

const FontSize = () => {
    const {resolvedTheme} = useTheme();
    const {config, setConfig } = useConfig();

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
    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            setConfig(prevConfig => ({
                ...prevConfig,
                fill: strokeColor[resolvedTheme][0]
            }));
        }
    }, [resolvedTheme, setConfig]);

    return(
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Font Size</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {buttons.map((data) => {
                    const Component = data.component
                    return (
                        <Button 
                        className={"text-xs"}
                        altText = {data.altText} key = {data.fontSize}>
                            {Component}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}

const TextAlign = () => {
    const {resolvedTheme} = useTheme();
    const {config, setConfig } = useConfig();

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
    useLayoutEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            setConfig(prevConfig => ({
                ...prevConfig,
                fill: strokeColor[resolvedTheme][0]
            }));
        }
    }, [resolvedTheme, setConfig]);

    return(
        <div className='flex flex-col gap-2'>
            <ConfigBarHeading>Text Align</ConfigBarHeading>
            <div className="flex gap-2 items-center">
                {buttons.map((data) => {
                    const Component = data.component
                    return (
                        <Button altText = {data.altText} key = {data.align}>
                            {<Component size = {12}/>}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}






