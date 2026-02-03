"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUser = (value) => {
    setUserState(value);
  };

  const logout = () => {
    setUserState(null);
    // opzionale: pulizia token/cookie/localStorage
    localStorage.removeItem("token");
  };

  // opzionale: carica utente all'avvio (es. da API o localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
