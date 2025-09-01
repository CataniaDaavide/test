"use client"
import { createContext, useContext } from "react";
import { ModalContext } from "./ModalContext";
import { Button } from "../components/ui/button";

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
          buttons: ["close", <Button color="danger" onClick={() => console.log("ciao")}><span>ciao</span></Button>],
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
