import { cn } from '@/lib/utils'
import type { Tools } from '@/manager/CanvasManager'
import { Hand, MousePointer2, RectangleHorizontal, Circle, DiamondIcon, MoveRight, LucideMoveHorizontal, Pen, type LucideIcon, type LucideProps } from 'lucide-react'
import React, { useState } from 'react'

interface ITools {
    name : Tools,
    Component : LucideIcon,
    number : number
}
const icons  : ITools[] = [
    {
        name : "hand",
        Component : Hand,
        number : 0
    },
    {
        name : "mouse",
        Component : MousePointer2,
        number : 1
    },
    {
        name : "rect",
        Component : RectangleHorizontal,
        number : 2
    },
    {
        name : "diamond",
        Component : DiamondIcon,
        number : 3
    },
    {
        name : "eclipse",
        Component : Circle,
        number : 4
    },
    {
        name : "rightArrow",
        Component : MoveRight,
        number : 6
    },
    {
        name : "line",
        Component : LucideMoveHorizontal,
        number : 7
    },
    {
        name : "pen",
        Component : Pen,
        number : 8
    },
]

interface IToolbar {
    setTool :((tool : Tools) => void) | undefined
    getTool : (() => Tools) | undefined
}
const  Toolbar = ({setTool, getTool} : IToolbar) => {

    const [state, setState] = useState<Tools>()
    const handleClick = (name : Tools) => {
        if(setTool && getTool){
            setTool(name)
            setState(name)
            console.log("setTool:", getTool())
        }
    }
  return (
    <div className='fixed top-5 left-0 right-0 h-12 flex justify-center items-cente p-0'>
        <div className="border-border bg-muted  w-md rounded-md flex items-center justify-between p-1">
            {icons.map(({name, Component, number}, index) => {
                    return (
                        <div
                        onClick={() => handleClick(name)} 
                        key = {index} 
                        className=
                        {cn(
                            " flex gap-1 items-end hover:bg-accent hover:text-accent-foreground p-2 cursor-pointer text-muted-foreground transition-all duration-300 rounded-md",
                            getTool && getTool() == name ? "bg-accent text-accent-foreground" : "",
                        )}> 
                            <Component></Component>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default  Toolbar