"use client";

//hoocks - functions - lib
import { cloneElement, isValidElement, useState } from "react";

//icons
import { Eye, EyeOff } from "lucide-react";

export default function InputPassword({
  title,
  name = "",
  required = false,
  placeholder,
  icon,
  ref,
  errorMessage = "",
  onKeyUp = () => {},
  disabled = false,
  className = "",
  color,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });
  const [showText, setShowText] = useState(false);

  const colorVariants = {
    trasparent: "!bg-trasparent",
    default: "!bg-card",
  };

  return (
    <div className="w-full flex flex-col gap-1 justify-center">
      {title && (
        <p className="text-xs font-medium">
          {title}
          {required && <span className="text-red-500"> *</span>}
        </p>
      )}
      <div className="relative w-full flex items-center justify-center">
        <div className="absolute left-3 text-muted-foreground">{iconLeft}</div>
        <input
          disabled={disabled}
          className={`
            w-full ${icon ? "pl-9" : "pl-4"} 
          ${errorMessage ? "border-red-500" : "border-border-card"} 
          pr-4 py-2 h-10 rounded-lg bg-transparent 
          border focus:border-2 focus:border-background-inverse focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
           ${colorVariants[color] || colorVariants["default"]} 
           ${className}`}
          name={name}
          type={showText ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="off"
          onKeyUp={(e) => {
            onKeyUp(e);
          }}
          ref={ref}
        />
        <button
          disabled={disabled}
          className="absolute p-2 right-3 cursor-pointer text-zinc-600 dark:text-zinc-400 disabled:cursor-auto disabled:opacity-50"
          onClick={() => setShowText(!showText)}
        >
          {showText ? (
            <Eye className={"transition-all duration-300"} size={16} />
          ) : (
            <EyeOff className={"transition-all duration-300"} size={16} />
          )}
        </button>
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
