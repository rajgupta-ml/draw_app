import { ToolComponent } from '@/constants/toolbarConstant'
import { cn } from '@/lib/utils'
import type { TOOLS_NAME } from '@/types/toolsTypes'
import React, { useState } from 'react'



interface IToolbar {
    setTool :((tool : TOOLS_NAME) => void) | undefined
    getTool : (() => TOOLS_NAME) | undefined
}
const  Toolbar = ({setTool, getTool} : IToolbar) => {

    const [state, setState] = useState<TOOLS_NAME>()
    const handleClick = (name : TOOLS_NAME) => {
        if(setTool && getTool){
            setTool(name)
            setState(name)
        }
    }
  return (
    <div className='fixed top-5 left-0 right-0 h-12 flex justify-center items-cente p-0'>
        <div className="border-border bg-muted  w-md rounded-md flex items-center justify-between p-1">
            {ToolComponent.map(({name, Component, number}, index) => {
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