"use client"
import { createContext, useContext } from "react";
import { ModalContext } from "./ModalContext";
import { Button } from "../components/ui/button";
import { TriangleAlert } from "lucide-react";

const ExceptionContext = createContext();

export function ExceptionProvider({ children }) {
  const { setModal } = useContext(ModalContext);

  const base_exceptionManager = (error) => {
    try {
      const { message } = error;
      setModal({
        show: true,
        type: "alert",
        data: {
          title: "Errore",
          icon: <TriangleAlert size={40} className="text-amber-600" />,
          buttons: ["close"],
          message: (
            <p className="text-muted-foreground">{message}</p>
          ),
        },
      });
    } catch (error) {}
  };

  return (
    <ExceptionContext.Provider value={{ base_exceptionManager }}>
      {children}
    </ExceptionContext.Provider>
  );
}

export function useExceptionManager() {
  return useContext(ExceptionContext);
}
