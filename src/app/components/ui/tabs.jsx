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
    <ul className="max-w-max flex p-1 border border-border-card rounded-xl bg-card">
      {tabs.map((tab, index) => {
        const { value: tabValue } = tab;
        return (
          <li key={index}>
            <button
              disabled={disabled}
              onClick={() => setValue(tab)}
              className={`
                px-3 py-1 rounded-lg text-sm
                transition-all duration-300
                cursor-pointer disabled:cursor-auto disabled:opacity-90 
                ${value === tabValue && "bg-zinc-300 dark:bg-zinc-700"}
                `}
            >
              {tabValue}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ExampleTabsComponents({}) {
  const tabs = [
    {
      value: "entrate",
      tab: <p>entrate tab</p>,
    },
    {
      value: "uscite",
      tab: <p>uscite tab</p>,
    },
  ];

  const [value, setValue] = useState(tabs[0]);

  return (
    <div className="flex flex-col gap-3 items-center justify-center w-full border p-3">
      <Tabs
        tabs={tabs}
        value={value.value}
        setValue={setValue}
        disabled={false}
      />
      {value.tab}
    </div>
  );
}
