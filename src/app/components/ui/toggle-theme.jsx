"use client";

//hoocks - functions - lib
import { useTheme } from "next-themes";

//icons
import { Moon, Sun } from "lucide-react";

//components
import { ButtonIcon } from "@/app/components/ui/button";

export default function ButtonToggleTheme({ className, color }) {
  const { theme, setTheme } = useTheme();
  if (!theme) return null;
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
