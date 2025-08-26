"use client";
import { useState, createContext } from "react";
import { menuItems } from "../(pages)/dashboard/layout";

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [activeTab, setActiveTab] = useState(menuItems[0]);

  return (
    <SidebarContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </SidebarContext.Provider>
  );
}
