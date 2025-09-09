import "./globals.css";

//hoocks - functions - lib
import { ThemeProvider } from "./context/ThemeContext";
import Modal from "./components/ui/modal/modal";
import { ModalProvider } from "./context/ModalContext";
import { ExceptionProvider } from "./context/ExceptionManagerContext";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full overscroll-none">
      {/* <html lang="en"> */}
      <head>
        {/* theme-color iniziale lato server */}
        <meta name="theme-color" content="#fafafa" />
      </head>
      <body
        className={`
          relative antialiased overscroll-none 
          w-full h-full
          flex flex-col items-center justify-center 
          bg-background text-background-inverse transition-all duration-100
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
      </body>
    </html>
  );
}
