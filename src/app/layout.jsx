import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'], // set di caratteri da caricare
  weight: ['400', '500', '700'], // pesi che ti servono
  style: ['normal'], // puoi aggiungere 'italic' se vuoi
  variable: '--font-poppins', // opzionale, se vuoi usarlo come CSS variable
});

export const metadata = {
  title: "ExpensiveTracker",
  description: "Gestore economico by DavideCatania",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark w-full h-full">
      <body
        className={`${poppins.className} w-full h-full flex antialiased overscroll-none overflow-hidden`}
      >
{children}
      </body>
    </html>
  );
}



