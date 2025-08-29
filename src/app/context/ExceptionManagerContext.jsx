"use client"
import { createContext, useContext } from "react";
import { ModalContext } from "./ModalContext";

const ExceptionContext = createContext();

export function ExceptionProvider({ children }) {
  const { setModal } = useContext(ModalContext);

  const base_exceptionManager = (error) => {
    try {
      const { message } = error;
      setModal({
        show: true,
        type: "error",
        data: {
          title: "Errore",
          // desciption: "Lorem Ipsum is simply dummy text",
          message: message,
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
