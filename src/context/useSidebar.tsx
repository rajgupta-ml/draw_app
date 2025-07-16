import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type sidebarType = "geometry" | "text";

type SidebarContextType = {
  showSidebar: sidebarType | null;
  toggleSidebar: (str: sidebarType | null) => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showSidebar, setShowbar] = useState<sidebarType | null>("geometry");

  const toggleSidebar = (args: sidebarType | null) => setShowbar(args);

  return (
    <SidebarContext.Provider
      value={{
        showSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined || context === null) {
    throw new Error("useConfig must be used within a ConfigContextProvider");
  }
  return context;
};

export default useSidebar;
