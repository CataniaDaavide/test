"use client";

//hoocks - functions - lib
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

//icons
import { Moon, Sun } from "lucide-react";

//components
import { ButtonIcon } from "./button/buttonIcon";

export default function ButtonToggleTheme({ className }) {
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
