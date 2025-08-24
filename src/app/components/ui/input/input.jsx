//hoocks - functions - lib
import { cloneElement, isValidElement, useState } from "react";
import TitleComponents from "../title-components";

//icons
import { Eye, EyeOff } from "lucide-react";

const colorVariants = {
  trasparent:
    "bg-trasparent border-border-card focus:border-background-inverse",
  default: "bg-card border-border-card focus:border-background-inverse",
};

export default function Input({
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
  rows,
  className = "",
  color,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });

  let InputSelected = <></>;

  switch (type) {
    case "text":
    case "email":
    case "date":
    case "time":
      InputSelected = (
        <InputBase
          type={type}
          disabled={disabled}
          icon={iconLeft}
          errorMessage={errorMessage}
          color={color}
          name={name}
          placeholder={placeholder}
          ref={ref}
          onKeyUp={onKeyUp}
          className={className}
        />
      );
      break;

    case "password":
      InputSelected = (
        <InputPassword
          disabled={disabled}
          icon={iconLeft}
          errorMessage={errorMessage}
          color={color}
          name={name}
          placeholder={placeholder}
          ref={ref}
          onKeyUp={onKeyUp}
        />
      );
      break;

    case "textarea":
      InputSelected = (
        <InputTextarea
          rows={rows}
          disabled={disabled}
          icon={iconLeft}
          errorMessage={errorMessage}
          color={color}
          name={name}
          placeholder={placeholder}
          ref={ref}
          onKeyUp={onKeyUp}
        />
      );
      break;

    default:
      break;
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <TitleComponents title={title} required={required} />
      {InputSelected}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}

function InputBase({
  type = "text",
  disabled,
  icon,
  errorMessage,
  color,
  name,
  placeholder,
  ref,
  onKeyUp = () => {},
  className,
}) {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute left-3 text-muted-foreground">{icon}</div>
      <input
        disabled={disabled}
        className={`
          w-full rounded-lg pr-4 py-2 h-10
          border focus:border-2 focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${icon ? "pl-9" : "pl-4"} 
          ${errorMessage && "border-red-500"} 
          ${className}`}
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
  );
}

function InputPassword({
  disabled,
  icon,
  errorMessage,
  color,
  name,
  placeholder = "••••••",
  ref,
  onKeyUp = () => {},
  className,
}) {
  const [showText, setShowText] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute left-3 text-muted-foreground">{icon}</div>
      <input
        disabled={disabled}
        className={`
          w-full rounded-lg pr-4 py-2 h-10
          border focus:border-2 focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${icon ? "pl-9" : "pl-4"} 
          ${errorMessage && "border-red-500"} 
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
  );
}

function InputTextarea({
  rows = 3,
  disabled,
  icon,
  errorMessage,
  color,
  name,
  placeholder,
  ref,
  onKeyUp = () => {},
  className,
}) {
  return (
    <textarea
      disabled={disabled}
      rows={rows}
      className={`
          w-full rounded-lg p-2
          border focus:border-2 focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${errorMessage && "border-red-500"} 
          ${className}`}
      name={name}
      placeholder={placeholder}
      autoComplete="off"
      onKeyUp={(e) => {
        onKeyUp(e);
      }}
      ref={ref}
    />
  );
}
