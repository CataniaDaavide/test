"use client";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`; // cookie di sessione
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // valore iniziale sicuro

  useEffect(() => {
    // legge cookie lato client
    const cookieTheme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1];

    if (cookieTheme) setTheme(cookieTheme);

    // applica classe HTML
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(cookieTheme || "light");

    // aggiorna cookie
    setCookie("theme", cookieTheme || "light");
  }, []);

  useEffect(() => {
    // aggiorna classe e cookie quando cambia il tema
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    setCookie("theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#09090b" : "#fafafa");
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
