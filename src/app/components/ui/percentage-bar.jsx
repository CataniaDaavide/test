"use client"
import { useState } from "react";
import TitleComponents from "./title-components";

export default function PercentageBar({ titleSx, titleDx, percentage, color }) {
  const [ss, s] = useState()
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between">
        <TitleComponents>{titleSx}</TitleComponents>
        {ss && <p>ciao</p>}
        <TitleComponents>{titleDx}</TitleComponents>
      </div>
      <div 
      onTouchStart={() => {s(true)}}
      onTouchEnd={() => {s(false)}}
      className="w-full h-[10px] rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full bg-background-inverse`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
