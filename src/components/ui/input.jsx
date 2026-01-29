"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Asterisk, CalendarIcon, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

// Variants e size, stile coerente con Button
const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border w-full min-w-0 rounded-md px-3 text-sm shadow-xs transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 focus-visible:border-ring",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "bg-transparent! border border-input shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 focus-visible:ring-ring/50 focus-visible:border-ring",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring/50 focus-visible:border-ring",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 focus-visible:ring-ring/50 focus-visible:border-ring",
        link: "bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-ring/50 focus-visible:border-ring",
        error: "border-destructive text-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive",
      },
      size: {
        default: "h-9 max-h-9! py-2",
        sm: "h-8 py-1.5 text-sm",
        lg: "h-10 py-3 text-base",
        textarea: "py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Input = React.forwardRef(
  (
    {
      type = "text",
      iconLeft,
      label,
      id,
      value,
      onChange,
      required,
      rows = 3,
      minRows,
      maxRows,
      error,
      className,
      action,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
    const Comp = asChild ? Slot : "input";

    return (
      <div className="w-full flex flex-col">
        {/* Label */}
        {label && <InputLabel id={id} label={label} required={required} />}

        <div className="relative w-full flex items-center">
          {/* Icon Left */}
          {iconLeft && <IconLeft icon={iconLeft} />}

          {/* Input / Textarea */}
          {type === "textarea" ? (
            <textarea
              id={id}
              ref={ref}
              rows={rows}
              value={value}
              onChange={onChange}
              style={{
                minHeight: minRows ? `${minRows * 1.5}em` : undefined,
                maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined,
                overflowY: maxRows ? "auto" : "hidden",
              }}
              className={cn(
                inputVariants({
                  variant: error ? "error" : variant || "default",
                  size: "textarea",
                }),
                iconLeft && "pl-11",
                className
              )}
              aria-invalid={!!error}
              {...props}
            />
          ) : (
            <Comp
              id={id}
              ref={ref}
              type={inputType}
              value={value}
              onChange={onChange}
              data-slot="input"
              className={cn(
                inputVariants({
                  variant: error ? "error" : variant || "default",
                  size: size || "default",
                }),
                iconLeft && "pl-11",
                type === "password" ? "pr-11" : "",
                className
              )}
              aria-invalid={!!error}
              {...props}
            />
          )}

          {/* Password Toggle */}
          {type === "password" && (
            <PasswordAction showPassword={showPassword} setShowPassword={setShowPassword} />
          )}

          {/* Date Picker */}
          {type === "date" && <DateAction value={value} onChange={onChange} />}

          {/* Azione custom */}
          {!["password", "date"].includes(type) && action}
        </div>

        {/* Errore */}
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

// Label
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

// Icon Left
function IconLeft({ icon }) {
  const renderIconLeft = icon ? React.cloneElement(icon, { className: "w-5 h-5" }) : null;
  return <span className="absolute left-3 flex items-center text-zinc-400">{renderIconLeft}</span>;
}

// Password Toggle
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

// Date Picker
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
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
          className="bg-card"
          mode="single"
          captionLayout="dropdown"
          fromDate={new Date(1900, 0, 1)}
          toDate={new Date(2100, 11, 31)}
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
            onChange({ target: { value: formatted } });
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { Input };
