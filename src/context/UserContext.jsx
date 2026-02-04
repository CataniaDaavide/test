"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ApiClient } from "@/lib/api-client";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUser = (value) => setUserState(value);

  // All’avvio, se c’è sessionToken recupera utente da /api/auth/me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const api = new ApiClient();
        const response = await api.get("/api/auth/me");
        
        if (response.success && response.data?.user) {
          setUserState(response.data.user);
        } else {
          setUserState(null);
        }
      } catch (err) {
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
