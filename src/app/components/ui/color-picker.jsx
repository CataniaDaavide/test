"use client";
import { useEffect } from "react";
import TitleComponents from "./title-components";

export const colorsOptions = [
  "bg-[#FF6B6B]",
  "bg-[#F06595]",
  "bg-[#845EF7]",
  "bg-[#5C7CFA]",
  "bg-[#339AF0]",
  "bg-[#22B8CF]",
  "bg-[#20C997]",
  "bg-[#51CF66]",
  "bg-[#94D82D]",
  "bg-[#FCC419]",
  "bg-[#FFA94D]",
  "bg-[#FF8787]",
  "bg-[#B197FC]",
  "bg-[#A9E34B]",
  "bg-[#66D9E8]",
];

export default function ColorPicker({ title, required = false, value, setValue, errorMessage = "", className = "" }) {
  useEffect(() => setValue(value ?? colorsOptions[0].split(/\[|\]/)[1]), []);

  return (
    <div className="w-full flex flex-col gap-1">
      <TitleComponents required={required} className={"!m-0"}>
        {title}
      </TitleComponents>
      <div
        className={`w-full grid gap-1 grid-cols-5 items-center justify-center h-full ${className}`}
      >
        {colorsOptions.map((item, index) => {
          return (
            <ItemListColorPicker
              key={index}
              color={item}
              value={value}
              setValue={setValue}
            />
          );
        })}
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}

function ItemListColorPicker({ color, value, setValue }) {
  return (
    <div
      className={`w-full h-12 p-1 rounded-xl ${
        `bg-[${value}]` === color && "border-2 !border-background-inverse"
      }`}
    >
      <button
        onClick={() => setValue(color.split(/\[|\]/)[1])}
        className={`w-full h-full flex items-center justify-center cursor-pointer rounded-lg ${color}`}
      />
    </div>
  );
}
