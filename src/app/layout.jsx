import "./globals.css";

//hoocks - functions - lib
import { ThemeProvider } from "./context/ThemeContext";
import Modal from "./components/ui/modal/modal";
import { ModalProvider } from "./context/ModalContext";
import { ExceptionProvider } from "./context/ExceptionManagerContext";
import { Html, Head, Main, NextScript } from "next/document";

export const metadata = {
  //   title: "Template APP",
  description: "Template applicazione web nextjs + tailwindcss",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  },
};

// Serve per non fare zoommare la pagina da mobile (qundo si fa il doppio click)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const themeColor = "#34cfeb"

export default function RootLayout({ children }) {
  return (
    <Html lang="en" className="w-full h-full overscroll-none">
      {/* <html lang="en"> */}
      <Head>
        <meta name="theme-color" content={themeColor} />
      </Head>
      <Main
        className={`
          relative antialiased overscroll-none 
          w-full h-full
          flex flex-col items-center justify-center 
          bg-background text-background-inverse
        `}
      >
        <ModalProvider>
          <ExceptionProvider>
            <ThemeProvider>
              <Modal />
              {children}
            </ThemeProvider>
          </ExceptionProvider>
        </ModalProvider>
      </Main>
    </Html>
  );
}
