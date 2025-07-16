import { cn } from '@/lib/utils';
import type { Shape } from '@/types/canvasTypes';
import { Minus, Plus, Redo, Undo } from 'lucide-react'
import React, { useEffect, useState} from 'react'


interface IZoomLayout  {
    getScale : () => string;
    scaleUp : () => void;
    scaleDown : () => void
    undoQueue : () => Shape[]
    redoQueue : () => Shape[]
    undo : () => void;
    redo : () => void
}
const ZoomLayout = ({scaleDown, scaleUp, getScale, undo, redo} : IZoomLayout) => {

    
    const [scale, setScale] = useState("100%");

    const handleZoomIn = () => {
        scaleUp();
        setScale(getScale());
    }

    const handleZoomOut = () => {
        scaleDown();
        setScale(getScale());
    }


    useEffect(() => {
        window.addEventListener("scale-change", () => setScale(getScale()));
        return () => window.removeEventListener("scale-change", () => setScale(getScale()));
    },[])
  return (
    <div className='absolute bottom-5 left-5 flex items-center gap-2 h-[30px] '>
        <div className='flex bg-sidebar border-border w-[120px] p-2 rounded-sm justify-between items-center  text-xs h-full'>
            <button className='cursor-pointer' onClick={handleZoomOut}>
                <Minus size={12}/>
            </button>
            <div>{scale}</div>
            <button className='cursor-pointer' onClick={handleZoomIn}>
                <Plus size={12}/>
            </button>
        </div>

        <div className='flex bg-sidebar h-full p-2 rounded-sm gap-5'>
            <button className='cursor-pointer' onClick={undo}><Undo size = {14}/></button>
            <button className='cursor-pointer' onClick={redo}><Redo size = {14}/></button>
        </div>
    </div>
  )
}

export default ZoomLayout