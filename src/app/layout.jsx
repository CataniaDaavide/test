import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import ButtonBack from "./components/ui/button/buttonBack";
import ButtonToggleTheme from "./components/ui/toggle-theme";

export const metadata = {
  title: "Template APP",
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
          antialiased overscroll-none 
          w-screen h-full max-h-[100dvh]
          flex flex-col items-center justify-center 
          bg-background text-background-inverse
        `}
      >
        <ThemeProvider>
          <ButtonBack className={"absolute top-3 left-3"} />
          <ButtonToggleTheme className={"absolute top-3 right-3"} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
