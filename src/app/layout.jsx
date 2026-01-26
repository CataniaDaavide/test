import { Poppins } from "next/font/google";
import "./globals.css";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import Loader from "@/components/Loader";
import { ErrorProvider } from "@/context/ErrorContext";
import ErrorDialog from "@/components/error-dialog";

const poppins = Poppins({
  subsets: ["latin"], // set di caratteri da caricare
  weight: ["400", "500", "700"], // pesi che ti servono
  style: ["normal"], // puoi aggiungere 'italic' se vuoi
  variable: "--font-poppins", // opzionale, se vuoi usarlo come CSS variable
});

// Serve per non fare zoommare la pagina da mobile (qundo si fa il doppio click)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "ExpensiveTracker",
  description: "Gestore economico by DavideCatania",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full" suppressHydrationWarning>
      <body
        className={`${poppins.className} w-full h-full flex antialiased overscroll-none overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoaderProvider>
            <ErrorProvider>
              {children}
              <ErrorDialog />
              <Loader />
            </ErrorProvider>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
