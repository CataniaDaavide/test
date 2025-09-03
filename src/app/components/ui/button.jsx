"use client";

//hoocks - functions - lib
import { useRouter } from "next/navigation";
import { cloneElement, isValidElement } from "react";
import { fetchApi } from "../../core/baseFunctions.js";

//icons
import { Loader, ChevronLeft, LogOut } from "lucide-react";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext.jsx";

const colorVariants = {
  trasparent: "bg-trasparent hover:bg-border-card",
  outline: "border border-background-inverse bg-trasparent",
  danger: "bg-red-700 hover:bg-red-600/90 text-white",
  success: "bg-green-700 hover:bg-green-600/90 text-white",
  secondary: "bg-border-card",
  primary:
    "bg-background-inverse hover:bg-background-inverse/90 text-background",
  default: "bg-border-card hover:dark:bg-border-card/90",
};

export function Button({
  onClick,
  color,
  disabled = false,
  isLoading = false,
  children,
  className = "",
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        flex gap-1 items-center justify-center px-4 py-2 w-full h-10 
        transition-all duration-300 
        text-sm font-semibold text-nowrap rounded-lg 
        cursor-pointer disabled:cursor-not-allowed disabled:opacity-90 active:scale-95 disabled:active:scale-100
        ${colorVariants[color] || colorVariants["default"]}
        ${className}
      `}
      onClick={onClick}
    >
      {isLoading ? <Loader size={20} className="animate-spin" /> : children}
    </button>
  );
}

export function ButtonIcon({
  icon,
  onClick,
  color,
  className = "",
  disabled = false,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });
  const colorVariants = {
    trasparent: "bg-trasparent hover:bg-border-card",
    outline: "border border-background-inverse bg-trasparent",
    success:
      "hover:bg-green-500/10 text-black dark:text-white hover:text-green-500",
    danger: "hover:bg-red-500/10 text-black dark:text-white hover:text-red-500",
    secondary: "bg-border-card",
    primary:
      "bg-background-inverse hover:bg-background-inverse/90 text-background",
    default: "bg-border-card hover:dark:bg-border-card/90",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center justify-center !w-10 !h-10 p-3 
        active:scale-95 transition-all duration-300 
        rounded-lg cursor-pointer disabled:cursor-auto disabled:opacity-50 
        ${colorVariants[color] || colorVariants["default"]} ${className}
      `}
    >
      {iconLeft}
    </button>
  );
}

export function ButtonBack({ className }) {
  const router = useRouter();

  // click sul pulsante per tornare alla pagina precedente
  const handleReturnBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <button
      onClick={handleReturnBack}
      className={`p-2 cursor-pointer ${className}`}
    >
      <ChevronLeft />
    </button>
  );
}

export function ButtonLogout({ color, className = "", showText = true }) {
  const { base_exceptionManager } = useExceptionManager();
  const router = useRouter();
  const handleLogout = async (e) => {
    try {
      e.preventDefault();

      // chimata endpoint /api/auth/login
      await fetchApi("/api/auth/logout", "POST", {}, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          base_exceptionManager({ message: data.error });
          return;
        }

        router.push("/login");
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      color={color}
      className={`text-red-500 ${className}`}
    >
      <LogOut size={16} />
      {showText && <span>Logout</span>}
    </Button>
  );
}

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
