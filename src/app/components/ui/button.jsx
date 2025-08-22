//icons
import { Loader } from "lucide-react";

export function Button({
  title,
  onClick,
  color,
  disabled = false,
  isLoading = false,
}) {
  const colorVariants = {
    outline:"border border-background-inverse bg-trasparent",
    secondary: "bg-zinc-200 hover:bg-zinc-200/80 dark:bg-zinc-700 hover:dark:bg-zinc-700/80",
    primary: "bg-background-inverse hover:bg-background-inverse/90 text-white dark:text-black",
    default:"bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
  };

  return (
    <button
      disabled={disabled}
      className={`px-3 py-2 h-10 font-medium text-sm rounded-md w-full cursor-pointer disabled:cursor-auto disabled:opacity-50 ${
        colorVariants[color] || colorVariants["default"]
      }`}
      onClick={onClick}
    >
      {isLoading ? <Loader size={20} className="animate-spin" /> : title}
    </button>
  );
}
