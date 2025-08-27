"use client";

import { ChevronDown, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TitleComponents from "./title-components";
import Input from "./input";

const colorVariants = {
  default: "bg-card border-border-card focus:border-background-inverse",
  // default: "bg-border-card border-0"
};


export function ExampleSelectComponent() {
  const options = [
    { value: "opzione1", data: { data1: "aaa", data2: "bbb", data3: "ccc" } },
    { value: "opzione2", data: { data1: "ddd", data2: "eee", data3: "fff" } },
    { value: "opzione3", data: { data1: "ggg", data2: "hhh", data3: "iii" } },
  ];

  const [value, setValue] = useState();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <Select
        title="Titolo"
        required={true}
        value={value}
        setValue={setValue}
        options={options}
        search={true}
      />
      <div className="w-full flex flex-col gap-1 text-center border p-3">
        <p className="text-green-500">Valore selezionato</p>
        <p className="text-blue-500 break-words">{JSON.stringify(value)}</p>
      </div>
    </div>
  );
}

export default function Select({
  title,
  required = false,
  // multiSelect = false,
  value,
  setValue,
  options = [],
  search = false,
  color,
  disabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Chiudi quando clicchi fuori
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (option === -1) {
      setValue({});
    } else {
      setValue(option);
    }

    setIsOpen(false); // chiudi dopo la selezione
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <TitleComponents title={title} required={required} />
      <SelectButton
        disabled={disabled}
        value={value?.value}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSelect={handleSelect}
        color={color}
        className={className}
      />
      <SelectOptions
        title={title}
        isOpen={isOpen}
        value={value?.value}
        options={options}
        handleSelect={handleSelect}
        search={search}
        color={color}
        className={className}
      />
    </div>
  );
}

function SelectButton({
  disabled,
  value,
  placeholder = "Seleziona",
  isOpen,
  setIsOpen,
  handleSelect,
  color,
  className,
}) {
  return (
    <div className="relative w-full">
      <button
        disabled={disabled}
        type="button"
        onClick={(e) => setIsOpen(!isOpen)}
        className={`
          flex items-center
          w-full rounded-lg px-3 py-2 h-10
          border focus:border-2 focus:outline-0
          disabled:opacity-50 
          ${colorVariants[color] || colorVariants["default"]} 
          ${className}`}
      >
        {value ? (
          <p>{value}</p>
        ) : (
          <p className="text-muted-foreground">{placeholder}</p>
        )}
      </button>
      <SelectOptionsDelete
        value={value}
        handleSelect={handleSelect}
        isOpen={isOpen}
      />
    </div>
  );
}

// pulsante x per elimiare la opzione selezionata
function SelectOptionsDelete({ value, handleSelect, isOpen }) {
  return (
    <div className="absolute top-1 right-0 flex items-center">
      {value && (
        <button
          onClick={(e) => {
            e.preventDefault(); // blocca il comportamento del button
            e.stopPropagation(); // blocca la propagazione al parent
            handleSelect(-1); // resetta il valore
          }}
          className="flex items-center justify-center p-2"
        >
          <X
            size={16}
            className="hover:text-red-500 transition-all duration-300"
          />
        </button>
      )}
      <div className="flex items-center justify-center p-2 pr-4">
        <ChevronDown
          size={16}
          className={`${isOpen && "rotate-180"} transition-all duration-300`}
        />
      </div>
    </div>
  );
}

// lista di opzioni selezionabili
function SelectOptions({
  title,
  isOpen,
  value,
  options,
  handleSelect,
  search,
  color,
  className,
}) {
  const [inputSearch, setInputSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState(options);

  useEffect(() => {
    if (inputSearch !== "") {
      setFilterOptions(
        options.filter((option) =>
          option.value.toLowerCase().includes(inputSearch.toLowerCase())
        )
      );
    } else {
      setFilterOptions(options);
    }
  }, [inputSearch, options]);

  return (
    <ul
      className={`
        absolute left-0 overflow-hidden overflow-y-auto 
        w-full rounded-xl p-1
        transition-all duration-200
        ${title ? "top-16" : "top-11"}
        ${isOpen ? "max-h-36 border" : "hidden border-0"}
        ${colorVariants[color] || colorVariants["default"]} 
        ${className}
      `}
    >
      {search && (
        <Input
          placeholder="Inserisci valore da cercare..."
          className="mb-1"
          onChange={(e) => setInputSearch(e.target.value)}
        />
      )}
      {search && filterOptions.length === 0 && (
        <p className="h-10 px-3 py-2 text-muted-foreground">
          Nessun risultatato per "{inputSearch}"
        </p>
      )}
      {filterOptions.map((option, index) => {
        return (
          <ItemListSelectOptions
            key={index}
            option={option}
            value={value}
            handleSelect={handleSelect}
          />
        );
      })}
    </ul>
  );
}

function ItemListSelectOptions({ option, value, handleSelect }) {
  const { value: optionValue } = option;

  return (
    <li
      onClick={() => handleSelect(option)}
      className={`
              flex items-center justify-between
              h-10 px-3 py-2 cursor-pointer rounded-lg hover:bg-zinc-300 hover:dark:bg-zinc-800 
              ${value === optionValue && "bg-zinc-300 dark:bg-zinc-800"}
            `}
    >
      {optionValue}
      {value === optionValue && value && <Check size={16} />}
    </li>
  );
}
