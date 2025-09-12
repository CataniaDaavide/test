"use client";
import { useState } from "react";
import TitleComponents from "./title-components";

export default function PercentageBar({ titleSx, titleDx, percentage, className, color }) {
  const [showPercentage, setShowPercentage] = useState();
  return (
    <div
      className={`relative w-full flex flex-col ${className}`}
      onMouseEnter={() => {
        setShowPercentage(true);
      }}
      onMouseLeave={() => {
        setShowPercentage(false);
      }}
      onTouchStart={() => {
        setShowPercentage(true);
      }}
      onTouchEnd={() => {
        setShowPercentage(false);
      }}
    >
      {showPercentage && (
        <div className="absolute -top-2 left-16 flex flex-col items-center justify-center">
          <div className="px-2 py-1 bg-background-inverse w-fit rounded-lg shadow-md">
            <p className="text-xs font-bold text-background">{percentage}%</p>
          </div>
          <div className="w-2 h-2 bg-background-inverse rotate-45 -translate-y-1 shadow-md" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <TitleComponents>{titleSx}</TitleComponents>
        <TitleComponents>{titleDx}</TitleComponents>
      </div>
      <div className="w-full h-[10px] rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className={`h-full rounded-full bg-background-inverse`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
