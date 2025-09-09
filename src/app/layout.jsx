import "./globals.css";

//hoocks - functions - lib
import { ThemeProvider } from "./context/ThemeContext";
import Modal from "./components/ui/modal/modal";
import { ModalProvider } from "./context/ModalContext";
import { ExceptionProvider } from "./context/ExceptionManagerContext";
import Script from "next/script";
import { cookies } from "next/headers";
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

export default async function RootLayout({ children }) {
  const theme = (await cookies()).get("theme")?.value || "light"

  return (
    <html lang="en" className={`w-full h-full overscroll-none ${theme}`}>
      {/* <html lang="en"> */}
      <head>
        {/* theme-color iniziale lato server */}
        <meta name="theme-color" content={theme === "dark" ? "#09090b" : "#fafafa"} />
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
