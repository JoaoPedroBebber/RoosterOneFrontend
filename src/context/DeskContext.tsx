import React, { createContext, useContext, useState } from "react";

type DeskRole = "usuario" | "tecnico" | "coordenador" | "admin";

interface DeskContextType {
  role: DeskRole;
  setRole: (role: DeskRole) => void;
}

const DeskContext = createContext<DeskContextType | undefined>(undefined);

export const DeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<DeskRole>(() => (localStorage.getItem("desk-role") as DeskRole) || "admin");

  const setRole = (nextRole: DeskRole) => {
    localStorage.setItem("desk-role", nextRole);
    setRoleState(nextRole);
  };

  return (
    <DeskContext.Provider value={{ role, setRole }}>
      {children}
    </DeskContext.Provider>
  );
};

export const useDeskRole = () => {
  const context = useContext(DeskContext);
  if (!context) {
    throw new Error("useDeskRole deve ser usado dentro de um DeskProvider");
  }
  return context;
};
