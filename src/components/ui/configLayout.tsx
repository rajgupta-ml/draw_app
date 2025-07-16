"use clients"
import React, {  useRef, useEffect, type ReactNode } from 'react';
import { useConfig, type TextOptionsPlusGeometricOptions } from '@/context/useConfigContext';
import useSidebar from '@/context/useSidebar';
import { GeometricConfig } from './configLayout/GeometricConfigLayout';
import { TextConfig } from './configLayout/TextConfigLayout';
import { useTheme } from 'next-themes';
import { strokeColor } from './configLayout/constant';
import { useSelectedShape } from '@/context/useSelectedShape';
import { useCanvasManagerContext } from '@/context/useCanvasManager';
import { UpdateCommand } from '@/canvas/UndoAndRedoCmd/ShapeCommand';


const ConfigLayout = () => {
    const {config, handleConfigChange, setConfig} = useConfig();
    const {canvasManager} = useCanvasManagerContext();
    const {executeCmd} = canvasManager;
    const {showSidebar} = useSidebar();
    const {resolvedTheme} = useTheme();
    const {selectedShape} = useSelectedShape();



    useEffect(() => {
        handleConfigChange({...config, stroke : resolvedTheme === "dark" ?  strokeColor.dark[0] : strokeColor.light[0],
        })
    },[resolvedTheme]);
    
    
    useEffect(() => {
        if (selectedShape && selectedShape.config) {
            setConfig((prevConfig: TextOptionsPlusGeometricOptions) => ({
                ...prevConfig,
                ...selectedShape.config,
            }));
        }
    }, [selectedShape]);


    useEffect(() => {
        if(selectedShape && selectedShape.config){
            executeCmd(new UpdateCommand(canvasManager, selectedShape, config))
        }
    },[config])
    if (showSidebar === null) return null;

    return (
        <>
            {showSidebar === "geometry" ? (
                <ConfigContainer><GeometricConfig/></ConfigContainer>
            ) : (
                <ConfigContainer><TextConfig/></ConfigContainer>
            )}
        </>
    );
};

export default ConfigLayout;


const ConfigContainer = ({children} : {children : ReactNode}) => {
    return (
        <div className="absolute left-5 top-1/2 -translate-y-1/2  min-w-[200px]">
        <div className="bg-sidebar shadow-accent-foreground shadow-2xl rounded-2xl h-full w-full p-4 flex flex-col gap-3">
            {children}
        </div>
        </div>
    )
}






