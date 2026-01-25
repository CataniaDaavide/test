"use client";

import { createContext, useContext, useState} from "react";

const ErrorContext = createContext({
  error: null,
  setError: () => {},
});

export const ErrorProvider = ({ children }) => {
  const [error, setErrorState] = useState(null);

  const setError = (value) => {
    setErrorState(value);
  };

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
