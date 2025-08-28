import "./globals.css";

//hoocks - functions - lib
import { ThemeProvider } from "./context/ThemeContext";
import Modal from "./components/ui/modal/modal";
import { ModalProvider } from "./context/ModalContext";

export const metadata = {
  //   title: "Template APP",
  description: "Template applicazione web nextjs + tailwindcss",
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
    <html lang="en" className="dark">
      {/* <html lang="en"> */}
      <body
        className={`
          relative antialiased overscroll-none 
          w-screen h-[100dvh]
          flex flex-col items-center justify-center 
          bg-background text-background-inverse
        `}
      >
        <ThemeProvider>
          <ModalProvider>
            <Modal />
            {children}
            </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
