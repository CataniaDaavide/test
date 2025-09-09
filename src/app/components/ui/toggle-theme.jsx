"use client";

//hoocks - functions - lib
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

//icons
import { Moon, Sun } from "lucide-react";

//components
import { ButtonIcon } from "@/app/components/ui/button";

export default function ButtonToggleTheme({ className, color }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
      <ButtonIcon
        icon={theme === "light" ? <Sun /> : <Moon />}
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
        className={className}
        color={color}
      />
  );
}
