import React, { useEffect, useState } from 'react'

const InputLayout = ({ref} : {ref : React.RefObject<HTMLDivElement | null>}) => {
    const [c, sC] = useState(1); 
    console.log(c);
    useEffect(() => {
        const handlerRender = () => sC(prev => prev+1)
        window.addEventListener("input-created", handlerRender)
        return () => window.removeEventListener("input-created", handlerRender);
    },[])
  return (
    <div ref = {ref}></div>
  )
}

export default InputLayout