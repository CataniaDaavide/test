"use client";

//#region imports
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { InputLabel } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
ScrollArea;
//#endregion

/**
 * SelectCustom
 * Componente Select personalizzato.
 *
 * Parametri:
 * - multiSelect: boolean, abilita la selezione multipla.
 * - options: array di oggetti { value, label }.
 * - search: boolean, abilita la ricerca all’interno delle opzioni.
 * - maxSelected: numero massimo di opzioni selezionabili (solo multiSelect).
 * - allowDeselect: boolean, permette di deselezionare un’opzione selezionata (solo select singola).
 * - className: classi CSS aggiuntive.
 * - placeholder: testo placeholder.
 */
export function SelectCustom({
  multiSelect = false,
  options = [],
  search = false,
  maxSelected = Infinity,
  className,
  id,
  label,
  required,
  value,
  setValue,
  placeholder,
  allowDeselect = false,
  classNameTrigger,
  classNameContent,
  error,
}) {
  if (multiSelect) {
    return (
      <MultiSelect
        options={options}
        search={search}
        id={id}
        label={label}
        required={required}
        maxSelected={maxSelected}
        className={className}
        value={value}
        setValue={setValue}
        placeholder={placeholder}
      />
    );
  }

  /**
   * Select singola
   * NOTA: usiamo SEMPRE Popover per evitare problemi di larghezza
   */
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const triggerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (open && triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  const filteredOptions = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(filter.toLowerCase()),
      )
    : options;

  const handleSelect = (option) => {
    if (allowDeselect && value?.value === option.value) {
      setValue(null);
    } else {
      setValue(option);
    }
    setOpen(false);
  };

  return (
    <div className="w-full flex flex-col">
      {/* label */}
      {label && <InputLabel id={id} label={label} required={required} />}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="secondary"
            role="combobox"
            className={cn(
              "w-full justify-between font-normal px-3 h-10",
              error && "border-destructive!",
              //modifiche
              classNameTrigger,
            )}
          >
            <span
              className={cn(
                value ? "text-black dark:text-white" : "text-muted-foreground",
                "text-sm",
              )}
            >
              {value ? value.label : placeholder || "Seleziona"}
            </span>

            <ChevronDown
              className={cn(
                "h-4 w-4 opacity-50",
                open && "rotate-180",
                "transition-all duration-300",
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          style={{ width }}
          onWheel={(e) => e.stopPropagation()}
          className={cn(
            "p-0 bg-background border border-border rounded-md shadow-md",
          )}
        >
          <Command className={classNameContent}>
            {search && (
              <CommandInput
                value={filter}
                onValueChange={setFilter}
                placeholder="Cerca..."
                className="text-sm h-10"
              />
            )}
            <ScrollArea className="h-32" noscrollbar>
              <CommandGroup>
                {filteredOptions.map((option, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(option)}
                    className={cn(
                      "justify-between cursor-pointer",
                      value?.value === option.value && "bg-secondary!",
                    )}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value?.value === option.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Errore */}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}

/**
 * MultiSelect
 * Componente per selezione multipla.
 *
 * Parametri:
 * - options: array di oggetti { value, label }.
 * - search: boolean, abilita la ricerca.
 * - maxSelected: numero massimo di opzioni selezionabili.
 * - placeholder: testo placeholder.
 * - className: classi CSS aggiuntive.
 */
function MultiSelect({
  options = [],
  search = false,
  maxSelected = Infinity,
  id,
  label,
  required,
  value,
  setValue,
  placeholder,
  className,
  error,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (open && triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  const toggleSelect = (itemValue) => {
    if (value.includes(itemValue)) {
      setValue((prev) => prev.filter((v) => v !== itemValue));
    } else if (value.length < maxSelected) {
      setValue((prev) => [...prev, itemValue]);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* label */}
      {label && <InputLabel id={id} label={label} required={required} />}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between font-normal bg-transparent hover:bg-transparent h-auto! min-h-10! px-3! py-1!",
              // modifiche
              "border-0!",
              className,
              error && "border-destructive!",
            )}
          >
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {value.length > 0 ? (
                value.map((val, index) => {
                  const item = options.find((o) => o.value === val);
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded text-xs px-2 py-1 bg-border gap-1"
                    >
                      {item?.label}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-sm text-muted-foreground">
                  {placeholder || "Seleziona"}
                </span>
              )}
            </div>

            <ChevronDown
              className={cn(
                "h-4 w-4 opacity-50",
                open && "rotate-180",
                "transition-all duration-300",
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          style={{ width }}
          onWheel={(e) => e.stopPropagation()}
          className="p-0 bg-background border border-border rounded-md shadow-md"
        >
          <Command>
            {search && (
              <CommandInput placeholder="Cerca..." className="text-sm h-10" />
            )}

            <ScrollArea className="h-32" noscrollbar>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const disabled = !isSelected && value.length >= maxSelected;

                  return (
                    <CommandItem
                      key={index}
                      onSelect={() => !disabled && toggleSelect(option.value)}
                      className={cn(
                        "justify-between cursor-pointer",
                        disabled && "opacity-50 pointer-events-none",
                      )}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Errore */}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
