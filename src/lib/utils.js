import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formatta una data in formato ISO in una stringa personalizzata.
 * Token supportati: yyyy, MM, dd, HH, mm, ss
 *
 * @param isoString Data ISO (default: data attuale)
 * @param format Formato di output (es. "yyyy/MM/dd", "dd-MM-yyyy HH:mm:ss")
 * @returns Data formattata come stringa
 */
export function formatDate(
  isoString = new Date().toISOString(),
  format
) {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const map = {
    yyyy: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return format.replace(
    /yyyy|MM|dd|HH|mm|ss/g,
    (token) => map[token],
  );
}