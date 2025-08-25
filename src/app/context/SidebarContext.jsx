"use client";
import { useState, createContext } from "react";

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <SidebarContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </SidebarContext.Provider>
  );
}
