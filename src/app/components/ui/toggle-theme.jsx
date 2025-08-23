"use client";
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ButtonIcon } from "./button/buttonIcon";
import { Moon, Sun } from "lucide-react";

export function ToggleTheme({ className }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={className}>
      <ButtonIcon
        icon={theme === "ligth" ? <Sun /> : <Moon />}
        fn={() => {
          setTheme(theme === "ligth" ? "dark" : "ligth");
        }}
        className={"!rounded-full"}
      />
    </div>
  );
}
