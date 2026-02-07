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
 * ESEMPI
 * formatDate("2025-01-15T10:30:00Z", "MMMM yyyy"); // "Gennaio 2025"
 * formatDate("2025-01-15T10:30:00Z", "dd MMMM yyyy"); // "15 Gennaio 2025"
 * formatDate("2025-01-15T10:30:00Z", "dd/MM/yyyy"); // "15/01/2025" 
 * formatDate(undefined, "MMMM yyyy"); // mese/anno attuale
 */
/**
 * Formatta una data in formato ISO in una stringa personalizzata.
 * Token supportati: yyyy, MM, dd, HH, mm, ss, MMMM
 *
 * @param isoString Data ISO (default: data attuale)
 * @param format Formato di output (es. "yyyy/MM/dd", "dd-MM-yyyy HH:mm:ss", "MMMM yyyy")
 * @returns Data formattata come stringa
 */
export function formatDate(
  isoString = new Date().toISOString(),
  format = "yyyy-MM-dd"
) {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const months = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const map = {
    yyyy: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    MMMM: months[date.getMonth()],
  };

  return format.replace(
    /yyyy|MMMM|MM|dd|HH|mm|ss/g,
    (token) => map[token]
  );
}

// ==============================
//        FORM FUNCTIONS
// ==============================

/**
 * Applica una serie di regole di input mask ad un campo del form
 *
 * @param {string} fieldName - nome del campo (es: "amount", "phone", "date")
 * @param {string} value - valore inserito dall'utente
 * @param {Object} formMask - oggetto che contiene le regole di mask per campo
 *
 * Struttura attesa:
 * {
 *   fieldName: [
 *     { mask: (value) => string },
 *     ...
 *   ]
 * }
 *
 * @returns {string} valore mascherato/formattato
 */
export function applyMaskField(fieldName, value, formMask) {
  const rules = formMask[fieldName] || [];
  let maskedValue = value;

  // applica tutte le regole in sequenza
  for (let rule of rules) {
    maskedValue = rule.mask(maskedValue);
  }

  return maskedValue;
}

/**
 * Valida un campo del form in base alle regole definite
 *
 * @param {string} fieldName - nome del campo (es: "amount", "email", "name")
 * @param {string} value - valore del campo da validare
 * @param {Object} formValidator - oggetto con le regole di validazione per campo
 *
 * Struttura attesa:
 * {
 *   fieldName: [
 *     {
 *       validate: (value) => boolean,
 *       message: "messaggio errore"
 *     },
 *     ...
 *   ]
 * }
 *
 * @returns {string} messaggio di errore oppure stringa vuota se valido
 */
export function validateField(fieldName, value, formValidator) {
  const rules = formValidator[fieldName] || [];

  // esegue le regole in ordine e ritorna il primo errore trovato
  for (let rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }

  return ""; // nessun errore
}


export function base_checkEmail(email) {
  /*
  - email: stringa da controllare se è un email corretta
  */

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ==============================
//       COLOR / STYLE HELPERS
// ==============================

/**
 * Converte un colore HEX in RGBA
 * @param hex - es: "#FF7A5A"
 * @param alpha - numero tra 0 e 1
 * @returns es: "rgba(255, 122, 90, 0.1)"
 */
export function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


/**
 * Formatta un importo numerico in valuta Euro (€) usando il formato italiano.
 *
 * Regole applicate:
 * - Aggiunge il simbolo € davanti all'importo
 * - Usa la virgola come separatore decimale
 * - Usa il punto come separatore delle migliaia
 * - Mostra sempre due decimali
 *
 * @param {number} amount - Importo numerico da formattare
 * @returns {string} Importo formattato (es: "€1.234,56")
 *
 * ESEMPI:
 * formatAmount(50.32);        // "€50,32"
 * formatAmount(1000);         // "€1.000,00"
 * formatAmount(1234567.89);   // "€1.234.567,89"
 * formatAmount(0);            // "€0,00"
 */
export function formatAmount(amount) {
  return (
    amount
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"
  );
}


