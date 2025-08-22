"use client";
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ButtonIcon } from "./buttonIcon";
import { Moon, Sun } from "lucide-react";

export function ToggleTheme({ className }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={className}>
      <ButtonIcon icon={theme === "ligth" ? <Sun /> : <Moon /> } fn={()=>{setTheme(theme === "ligth" ? "dark" : "ligth")}}/>
    </div>
  );
}

/*
"use client";
// HOOCKS E CONTEXT
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

// ICONS
import { Sun, Moon } from "lucide-react";

// COMPONENTS
import { ButtonIcon } from "@/app/components/button";

export default function ToggleTheme() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="cursor-pointer active:scale-[0.95]">
      <ButtonIcon
        icon={theme === "ligth" ? <Sun /> : <Moon />}
        color={"start"}
        fn={() => {
          setTheme(theme === "ligth" ? "dark" : "ligth");
        }}
      />
    </div>
  );
}
*/
