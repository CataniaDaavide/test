"use client";

// hoocks - functions - lib
import { useState } from "react";

export default function Tabs({
  tabs,
  value,
  setValue,
  disabled = false,
  color,
  className = "",
}) {
  return (
    <ul className="flex p-1 border border-border-card rounded-lg bg-card">
      {tabs.map((tab, index) => {
        return (
          <ItemListTabs
            key={index}
            disabled={disabled}
            tab={tab}
            currentValue={value}
            setValue={setValue}
          />
        );
      })}
    </ul>
  );
}

function ItemListTabs({ disabled, tab, currentValue, setValue }) {
  const { label, value } = tab;

  return (
    <li>
      <button
        disabled={disabled}
        onClick={() => setValue(value)}
        className={`
          px-3 py-1 rounded-md text-sm
          transition-all duration-300
          cursor-pointer disabled:cursor-auto disabled:opacity-90 
          ${currentValue === value && "bg-zinc-300 dark:bg-zinc-800"}
          `}
      >
        {label}
      </button>
    </li>
  );
}

export function ExampleTabsComponents({}) {
  const [tabValue, setTabValue] = useState(1);
  const tabs = [
    {
      label: "tab1",
      value: 1,
    },
    {
      label: "tab2",
      value: 2,
    },
    {
      label: "tab3",
      value: 3,
    },
  ];

  return (
    <div className="flex flex-col gap-1 items-center justify-center w-full p-3 border">
      <p>esempio tab component</p>
      <Tabs
        tabs={tabs}
        value={tabValue}
        setValue={setTabValue}
        disabled={false}
      />
      {tabValue === 1 && <p>valore scelto : 1</p>}
      {tabValue === 2 && <p>valore scelto : 2</p>}
      {tabValue === 3 && <p>valore scelto : 3</p>}
    </div>
  );
}
