"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Asterisk, CalendarIcon, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

function Input({
  type = "text",
  iconLeft,
  label,
  id,
  value,
  onChange,
  required,
  error,
  className,
  action,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full flex flex-col">
      {/* label */}
      {label && <InputLabel id={id} label={label} required={required} />}

      <div className="relative w-full flex items-center">
        {/* icona sx */}
        {iconLeft && <IconLeft icon={iconLeft} />}
      
        <input
          id={id}
          type={inputType}
          data-slot="input"
          value={value}
          onChange={onChange}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            iconLeft && "pl-11",
            type === "password" ? "pr-11" : "",
            error
              ? "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive"
              : "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            // modifiche
              "text-sm ring-0!",
              className,
          )}
          aria-invalid={!!error}
          {...props}
        />

        {type === "password" && (
          <PasswordAction
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}

        {type === "date" && <DateAction value={value} onChange={onChange} />}

        {!["password", "date"].includes(type) && action}
      </div>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}

export { Input };

export function InputLabel({ id, label, required }) {
  return (
    <Label
      htmlFor={id}
      className="mb-1 gap-0 items-center text-sm text-zinc-700 dark:text-zinc-300"
    >
      {label} {required && <Asterisk className="w-3 h-3" />}
    </Label>
  );
}

function IconLeft({ icon }) {
  const renderIconLeft = icon
    ? React.cloneElement(icon, { className: "w-5 h-5" })
    : null;

  return (
    <span className="absolute left-3 flex items-center text-zinc-400">
      {renderIconLeft}
    </span>
  );
}

// PASSWORD TOGGLE
function PasswordAction({ showPassword, setShowPassword }) {
  return (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 cursor-pointer flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );
}

// CALENDAR POPUP
function DateAction({ value, onChange }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "hidden md:flex",
            "absolute right-3 cursor-pointer items-center justify-center",
            open
              ? "text-zinc-600 dark:text-zinc-200"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200",
          )}
        >
          <CalendarIcon size={20} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="z-999 w-auto overflow-hidden p-0 border rounded-md shadow-xl translate-x-1"
        align="end"
        alignOffset={-8}
        sideOffset={10}
      >
        <Calendar
          className={"bg-card"}
          mode="single"
          captionLayout="dropdown"
          fromDate={new Date(1900, 1, 1)} // 1 gennaio 1900
          toDate={new Date(2100, 12, 31)} // 31 Dicembre 2100
          selected={value ? new Date(value) : new Date()}
          onSelect={(date) => {
            if (!date) return;
            const d = new Date(date);
            const formatted =
              d.getFullYear() +
              "-" +
              String(d.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(d.getDate()).padStart(2, "0");
            console.log(date, formatted);
            onChange({ target: { value: formatted } });
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
