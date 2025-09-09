"use client";
import { useState, useEffect, createContext } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  // Recupero tema salvato
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#231B25" : "#FBFBFB");
    }
  }, [theme]);

  // Aggiornamento del tema ad ogni variazione della variabile "theme"
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark"); // ✅ fix typo

    if (theme) {
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  if (theme === null) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
