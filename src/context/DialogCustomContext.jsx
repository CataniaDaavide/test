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

    const color = dialog.show ? "#ef4444" : "#f97316";

    meta.setAttribute("content", color);
  }, [dialog.show]);

  return (
    <DialogCustomContext.Provider value={{ dialog, setDialog }}>
      {children}
    </DialogCustomContext.Provider>
  );
};

export const useDialogCustom = () => useContext(DialogCustomContext);
