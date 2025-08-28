"use client";
import { useState, createContext } from "react";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    show: false,
    type: "",
    data: {},
  });

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {children}
    </ModalContext.Provider>
  );
}
