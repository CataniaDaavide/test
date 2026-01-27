"use client";

import { createContext, useContext, useState } from "react";

const DialogCustomContext = createContext({
  dialog: null,
  setDialog: () => {},
});

export const DialogCustomProvider = ({ children }) => {
  const [dialog, setDialogState] = useState(null);

  const setDialog = (value) => {
    setDialogState(value);
  };

  return (
    <DialogCustomContext.Provider value={{ dialog, setDialog }}>
      {children}
    </DialogCustomContext.Provider>
  );
};

export const useDialogCustom = () => useContext(DialogCustomContext);
