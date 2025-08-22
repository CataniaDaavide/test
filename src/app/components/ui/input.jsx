//hoocks - functions - lib
import { Eye, EyeOff } from "lucide-react";
import { cloneElement, isValidElement, useState } from "react";

export function Input({
  title,
  name = "",
  type = "text",
  required = false,
  placeholder,
  icon,
  ref,
  errorMessage = "",
  onKeyUp = () => {},
  disabled = false,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });

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
          className={`w-full ${icon ? "pl-9" : "pl-4"} ${
            errorMessage
              ? "border-red-500"
              : "border-border-card"
          } pr-4 py-2 h-10 rounded-md border bg-transparent focus:border-2 focus:border-background-inverse focus:outline-0 placeholder:text-muted-foreground disabled:opacity-50`}
          name={name}
          type={type}
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

export function InputPassword({
  title,
  name = "",
  required = false,
  placeholder,
  icon,
  ref,
  errorMessage = "",
  onKeyUp = () => {},
  disabled = false,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });
  const [showText, setShowText] = useState(false);

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
          className={`w-full ${icon ? "pl-9" : "pl-4"} ${
            errorMessage
              ? "border-red-500"
              : "border-border-card"
          } pr-9 py-2 h-10 rounded-md border bg-transparent focus:border-2 focus:border-background-inverse focus:outline-0 placeholder:text-muted-foreground disabled:opacity-50`}
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
          className="absolute right-3 cursor-pointer text-zinc-600 dark:text-zinc-400 disabled:cursor-auto disabled:opacity-50"
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
