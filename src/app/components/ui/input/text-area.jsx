//hoocks - functions - lib
import { Rows } from "lucide-react";
import { cloneElement, isValidElement, useState } from "react";

export default function Textarea({
  title,
  name = "",
  required = false,
  placeholder,
  icon,
  ref,
  rows = 3,
  errorMessage = "",
  onKeyUp = () => {},
  disabled = false,
  className = "",
  color,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });

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
        <textarea
          disabled={disabled}
          rows={rows}
          className={`
            w-full ${icon ? "pl-9" : "pl-4"} 
          ${errorMessage ? "border-red-500" : "border-border-card"} 
          pr-4 py-2 rounded-lg bg-transparent 
          border focus:border-2 focus:border-background-inverse focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
           ${colorVariants[color] || colorVariants["default"]} 
           ${className}`}
          name={name}
          placeholder={placeholder}
          autoComplete="off"
          onKeyUp={(e) => {
            onKeyUp(e);
          }}
          ref={ref}
        />
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
