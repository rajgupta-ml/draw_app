import type { Shape } from '@/types/canvasTypes'
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type SelectedShapeContextType = {
  selectedShape: Shape | null
  setSelectedShape: (shape: Shape | null) => void
}

const SelectedShapeContext = createContext<SelectedShapeContextType | undefined>(undefined)

export const SelectedShapeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)

  useEffect(() => {
    const handleSelectedShape = (e: Event) => {
      const selectedShapes = (e as CustomEvent).detail.selectedShapes
      setSelectedShape(selectedShapes)
    }
    window.addEventListener('selectShape', handleSelectedShape)
    return () => {
      window.removeEventListener('selectShape', handleSelectedShape)
    }
  }, [])

  return (
    <SelectedShapeContext.Provider value={{ selectedShape, setSelectedShape }}>
      {children}
    </SelectedShapeContext.Provider>
  )
}

export const useSelectedShape = () => {
  const context = useContext(SelectedShapeContext)
  if (context === undefined) {
    throw new Error('useSelectedShape must be used within a SelectedShapeProvider')
  }
  return context
}

