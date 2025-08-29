"use client";

//hoocks - functions - lib
import { cloneElement, isValidElement, useState } from "react";
import TitleComponents from "./title-components";

//icons
import { Eye, EyeOff } from "lucide-react";

const colorVariants = {
  outline: "bg-trasparent border-border-card focus:border-background-inverse",
  primary: "bg-border-card border-0",
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
  onChange = () => {},
  onKeyUp = () => {},
  disabled = false,
  rows,
  className = "",
  color,
}) {
  // Cloniamo le icone per forzare il size
  const iconLeft = isValidElement(icon) && cloneElement(icon, { size: 16 });

  let InputSelected = (<></>);

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
          onChange={onChange}
          className={className}
        />
      );
      break;

    case "tel":
      InputSelected = (
        <InputTel
          disabled={disabled}
          icon={iconLeft}
          errorMessage={errorMessage}
          color={color}
          name={name}
          placeholder={placeholder}
          ref={ref}
          onKeyUp={onKeyUp}
          onChange={onChange}
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
          onChange={onChange}
          className={className}
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
          onChange={onChange}
          className={className}
        />
      );
      break;

    default:
      break;
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <TitleComponents required={required}>{title}</TitleComponents>
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
  onChange = () => {},
  className = "",
}) {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute left-3 text-muted-foreground">{icon}</div>
      <input
        disabled={disabled}
        // la classe apparence-none evita la perdita dello stile dopo la valorizzazione
        // senza di quello perde il padding sinistro e si sovrappone l'icona
        className={`
          appearance-none
          w-full rounded-lg px-4 py-2 h-10 text-sm
          border focus:border-2 focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${icon && "pl-9"} 
          ${errorMessage && "border-red-500"} 
          ${className}`}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        onKeyUp={(e) => {
          onKeyUp(e);
        }}
        onChange={(e) => {
          onChange(e);
        }}
        ref={ref}
      />
    </div>
  );
}

function InputTel({
  disabled,
  errorMessage,
  color,
  name,
  value = 0,
  ref,
  onChange = () => {},
  className = "",
  placeholder = "0,00",
}) {
  const handleChange = (e) => {
    let val = e.target.value;

    // 1. Rimuovi caratteri non validi (solo numeri, punto, virgola)
    val = val.replace(/[^0-9.,]/g, "");

    // 2. Normalizza sempre la virgola in punto (più semplice da gestire)
    val = val.replace(",", ".");

    // 3. Permetti solo un separatore decimale
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts.slice(1).join("");
    }

    // 4. Limita a massimo 2 cifre dopo la virgola/punto
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
      val = parts.join(".");
    }

    // 5. Aggiorna il valore
    e.target.value = val;
    onChange(e);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <input
        disabled={disabled}
        inputMode="decimal"  
        className={`
          appearance-none
          w-full rounded-lg px-4 py-2 h-10 text-sm   
          border focus:border-2 focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${errorMessage && "border-red-500"} 
          ${className}`}
        name={name}
        type="tel"          
        defaultValue={value}
        autoComplete="off"
        placeholder={placeholder}
        onChange={handleChange}
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
  onChange = () => {},
  className = "",
}) {
  const [showText, setShowText] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute left-3 text-muted-foreground">{icon}</div>
      <input
        disabled={disabled}
        // la classe apparence-none evita la perdita dello stile dopo la valorizzazione
        // senza di quello perde il padding sinistro e si sovrappone l'icona
        className={`
          appearance-none
          w-full rounded-lg px-4 py-2 h-10 text-sm   
          border focus:border-2 focus:outline-0 
          placeholder:text-muted-foreground disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${icon && "pl-9"} 
          ${errorMessage && "border-red-500"} 
          ${className}`}
        name={name}
        type={showText ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="off"
        onKeyUp={(e) => {
          onKeyUp(e);
        }}
        onChange={(e) => {
          onChange(e);
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
  onChange = () => {},
  className = "",
}) {
  return (
    <textarea
      disabled={disabled}
      rows={rows}
      className={`
          w-full rounded-lg p-2 text-sm
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
      onChange={(e) => {
        onChange(e);
      }}
      ref={ref}
    />
  );
}
