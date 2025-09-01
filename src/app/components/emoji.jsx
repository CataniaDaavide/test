import { hexToRgba } from "../core/baseFunctions";

export default function Emoji({ emoji, hexColor }) {
  return (
    <div
      className="text-xl min-w-14 h-14 flex items-center justify-center rounded-full border-2 select-none"
      style={{
        backgroundColor: hexToRgba(hexColor, 0.1),
        borderColor: hexToRgba(hexColor, 0.3),
      }}
    >
      {emoji}
    </div>
  );
}