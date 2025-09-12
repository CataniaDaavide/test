"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeColorMeta() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const current = theme === "system" ? systemTheme : theme;
    const color = current === "dark" ? "#09090b" : "#fafafa";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
  }, [theme, systemTheme]);

  return null;
}

export function useThemeColor() {
  var themeColor = "#fafafa";
  const setThemeColor = (color) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", color);
      themeColor = color;
    }
    return;
  };

  return { themeColor, setThemeColor };
}
