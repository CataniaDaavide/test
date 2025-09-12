"use client";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

function setThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#09090b" : "#fafafa");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(storedTheme);
    setThemeColor(storedTheme);
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark" || theme === "light") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
      setThemeColor(theme);
    }
  }, [theme]);

  if (!theme) return null;

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
