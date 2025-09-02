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
  title,
  required = false,
  errorMessage = "",
  className = "",
}) {
  useEffect(() => setValue(value ?? emojisOptions[0]), []);

  return (
    <div className="w-full flex flex-col gap-1">
      <TitleComponents required={required}>{title}</TitleComponents>
      <div
        className={`
            w-full flex flex-wrap gap-3 md:grid md:grid-cols-6 items-center justify-center h-[160px]
            overflow-scroll overflow-x-hidden border border-border-card p-3 rounded-xl ${errorMessage && "!border-red-500"}${className}
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
            ${value == emoji && "!border-background-inverse !bg-border-card"}
        `}
    >
      {emoji}
    </button>
  );
}
