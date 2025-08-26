import { cloneElement, isValidElement } from "react";

export function ButtonIcon({ icon, fn, color, className, disabled = false }) {
  // const colorVariants = {
  //   primary:
  //     "hover:bg-blue-500/10 text-black dark:text-white hover:text-green-500",
  //   secondary: "bg-gray-600 hover:bg-gray-600/90 border-gray-500 text-white",
  //   success:
  //     "hover:bg-green-500/10 text-black dark:text-white hover:text-green-500",
  //   danger: "hover:bg-red-500/10 text-black dark:text-white hover:text-red-500",
  //   start: "hover:bg-white hover:dark:bg-zinc-800",
  //   default_due:
  //     "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 hover:dark:bg-zinc-800/80 text-black dark:text-white",
  //   default: "bg-card rounded-lg border-border-card shadow-md",
  //   //   "bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 hover:dark:bg-zinc-50/90 text-zinc-50 dark:text-zinc-950",
  // };

  const colorVariants = {
    trasparent: "bg-trasparent hover:bg-border-card !border-0",
    outline:
      "border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700",
    secondary: "bg-zinc-200 dark:bg-zinc-800",
    primary: "bg-background-inverse text-white dark:text-black",
    default: "bg-card hover:bg-border-card border border-border-card shadow-md",
  };

  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });

  return (
    <button
      disabled={disabled}
      onClick={fn}
      className={`
        flex items-center justify-center w-10 h-10 
        active:scale-95 transition-all duration-300 
        rounded-lg cursor-pointer disabled:cursor-auto disabled:opacity-50 
        ${colorVariants[color] || colorVariants["default"]} ${className}
      `}
    >
      {iconLeft}
    </button>
  );
}
