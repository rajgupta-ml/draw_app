import { Minus, Plus, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useState } from 'react'


interface IZoomLayout  {
    getScale : () => string;
    scaleUp : () => void
    scaleDown : () => void
}
const ZoomLayout = ({scaleDown, scaleUp, getScale} : IZoomLayout) => {
    const [scale, setScale] = useState("100%");
    const handleZoomIn = () => {
        scaleUp();
        setScale(getScale());
    }

    const handleZoomOut = () => {
        scaleDown();
        setScale(getScale());
    }
  return (
    <div className='absolute bottom-5 left-5 '>
        <div className='flex bg-sidebar border-border w-[120px] p-2 rounded-sm justify-between items-center  text-xs'>
            <button className='cursor-pointer' onClick={handleZoomOut}>
                <Minus size={12}/>
            </button>
            <div>{scale}</div>
            <button className='cursor-pointer' onClick={handleZoomIn}>
                <Plus size={12}/>
            </button>
        </div>
    </div>
  )
}

export default ZoomLayout