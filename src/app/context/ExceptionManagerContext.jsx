"use client";
import { createContext, useContext } from "react";
import { ModalContext } from "./ModalContext";
import { TriangleAlert } from "lucide-react";

export const ExceptionContext = createContext({});

export function ExceptionProvider({ children }) {
  const { setModal } = useContext(ModalContext);

  function getErrorLocation(stack) {
    if (!stack) return null;

    const lines = stack.split("\n");
    // cerco la prima riga che contenga un file sorgente .js/.jsx
    const firstSourceLine = lines.find((line) => /\w+\.(js|jsx|ts|tsx):\d+:\d+/.test(line));

    if (!firstSourceLine) return null;

    // regex per catturare file, riga e colonna
    const match = firstSourceLine.match(/([^\s()]+):(\d+):(\d+)/);
    if (!match) return null;

    return {
      file: match[1], // es. modal-transiction.jsx
      line: match[2], // es. 156
      column: match[3], // es. 79
    };
  }

  const base_exceptionManager = (error) => {
    console.log(error);

    try {
      const { name, message, stack } = error;
      const location = getErrorLocation(stack);

      setModal({
        show: true,
        type: "alert",
        data: {
          title: "Errore",
          icon: <TriangleAlert size={40} className="text-amber-600" />,
          buttons: message === "Sessione non trovata" ? ["login"] : ["close"],
          message: (
            <div className="text-muted-foreground flex flex-col gap-1">
              <p>
                <strong>Nome:</strong> {name}
              </p>
              <p>
                <strong>Messaggio:</strong> {message}
              </p>
              {location && (
                <p>
                  <strong>File:</strong> {location.file}, <strong>Riga:</strong> {location.line}
                </p>
              )}
            </div>
          ),
        },
      });
    } catch (err) {
      console.error("Errore nel gestore delle eccezioni:", err);
    }
  };

  return <ExceptionContext.Provider value={{ base_exceptionManager }}>{children}</ExceptionContext.Provider>;
}

export function useExceptionManager() {
  return useContext(ExceptionContext);
}
