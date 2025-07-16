import type { Shape } from "@/types/canvasTypes";
import { Preahvihear } from "next/font/google";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SelectedShapeContextType = {
  selectedShape: Shape | null;
  setSelectedShape: (shape: Shape | null) => void;
};

interface ShapeSelectedEventDetail {
  selectedShapes: Shape; // Assuming selectedShapes is an array of Shape
}
const SelectedShapeContext = createContext<
  SelectedShapeContextType | undefined
>(undefined);

export const SelectedShapeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  useEffect(() => {
    const handleSelectedShape = (e: Event) => {
      const selectedShapes = (e as CustomEvent<ShapeSelectedEventDetail>).detail
        .selectedShapes;
      setSelectedShape(selectedShapes)
    };

    const handleUnselectShape = () => {
      console.log("I reach herre")
      setSelectedShape(null);
    }
    window.addEventListener("selectShape", handleSelectedShape);
    window.addEventListener("no-shape-selected", handleUnselectShape)
    return () => {
      window.removeEventListener("selectShape", handleSelectedShape);
      window.removeEventListener("no-shape-selected", handleUnselectShape)

    };
  }, []);

  return (
    <SelectedShapeContext.Provider value={{ selectedShape, setSelectedShape }}>
      {children}
    </SelectedShapeContext.Provider>
  );
};

export const useSelectedShape = () => {
  const context = useContext(SelectedShapeContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedShape must be used within a SelectedShapeProvider",
    );
  }
  return context;
};
