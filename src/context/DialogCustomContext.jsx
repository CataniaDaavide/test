"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DialogCustomContext = createContext({
  dialog: null,
  setDialog: () => {},
});

export const DialogCustomProvider = ({ children }) => {
  const [dialog, setDialogState] = useState({
    show: false,
    type: "",
    data: {},
  });

  const setDialog = (value) => {
    setDialogState(value);
  };

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    const currentTheme =
      document.documentElement.classList.contains("dark") ? "dark" : "light";

    const color = dialog.show
      ? "#000000" // colore quando dialog aperto (puoi scegliere overlay-like)
      : currentTheme === "dark"
      ? "#09090b"
      : "#fafafa";

    meta.setAttribute("content", color);
  }, [dialog.show]);

  return (
    <DialogCustomContext.Provider value={{ dialog, setDialog }}>
      {children}
    </DialogCustomContext.Provider>
  );
};

export const useDialogCustom = () => useContext(DialogCustomContext);
