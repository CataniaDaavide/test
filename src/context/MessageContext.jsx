"use client";

import { createContext, useContext, useState } from "react";

/*
Lo state ora può contenere:
{
  status: "info" | "success" | "error" | "warning",
  title: string,
  description: string,
  actions: [ { label: string, onClick: function, variant?: string } ]
}
*/

const MessageContext = createContext({
  message: null,
  setMessage: () => {},
});

export const MessageProvider = ({ children }) => {
  const [message, setMessageState] = useState(null);

  const setMessage = (value) => {
    setMessageState(value);
  };

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
