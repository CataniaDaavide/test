"use client";
import { useEffect } from "react";
import TitleComponents from "./title-components";

export const emojisOptions = [
  "🛒",
  "🍔",
  "🍕",
  "🥗",
  "🍣",
  "☕",
  "🍺",
  "🍩",
  "🚗",
  "⛽",
  "🚌",
  "🚕",
  "🏠",
  "🛋️",
  "🧹",
  "💡",
  "📱",
  "🖥️",
  "🎁",
  "🎉",
  "🎮",
  "📚",
  "✈️",
  "🧳",
  "🏖️",
  "💊",
  "🏥",
  "🦷",
  "👶",
  "🍼",
  "🐶",
  "🐾",
  "🛍️",
  "👗",
  "👟",
  "💄",
  "💅",
  "💼",
  "🧾",
  "📈",
  "💰",
  "💸",
  "🏦",
  "🔧",
  "🛠️",
  "🧘",
  "🧖",
  "🏋️",
  "⚽",
  "🖼️",
  "🎬",
  "🎵",
  "🌸",
  "🪴",
  "📦",
  "💳",
  "🏫",
  "🗑️",
  "📥",
  "🎯",
  "🧑‍💻",
  "🔗",
  "💼",
  "📊",
  "🚨",
  "❤️",
  "🛡️",
  "📦",
  "🅿️",
  "🚿",
  "⛽",
  "🥐",
  "🍹",
];

export default function EmojiPicker({
  value,
  setValue,
  errorMessage = "",
  className = "",
}) {
  useEffect(() => setValue(emojisOptions[0]), []);

  return (
    <div className="w-full flex flex-col gap-1">
      <TitleComponents required={true}>Emoji</TitleComponents>
      <div
        className={`
            w-full grid gap-3 grid-cols-6 items-center justify-center h-full max-h-[300px] 
            overflow-scroll border border-border-card p-3 rounded-xl ${errorMessage && "!border-red-500"}${className}
        `}
      >
        {emojisOptions.map((item, index) => {
          return (
            <ItemListEmojiPicker
              key={index}
              emoji={item}
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

function ItemListEmojiPicker({ emoji, value, setValue }) {
  return (
    <button
      onClick={() => setValue(emoji)}
      className={`
            flex items-center justify-center cursor-pointer h-15 w-15 text-xl
            border-2 rounded-lg border-border-card
            ${value === emoji && "!border-background-inverse !bg-border-card"}
        `}
    >
      {emoji}
    </button>
  );
}
