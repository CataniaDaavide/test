"use client";

import * as React from "react";

const LoaderContext = React.createContext({
  isLoaderActive: false,
  setLoader: () => {},
});

export const LoaderProvider = ({ children }) => {
  const [isLoaderActive, setIsLoaderActive] = React.useState(false);

  const setLoader = (value) => {
    setIsLoaderActive(value);
  };

  return (
    <LoaderContext.Provider value={{ isLoaderActive, setLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => React.useContext(LoaderContext);
