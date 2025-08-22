// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Template APP",
  description: "Template applicazione web nextjs + tailwindcss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      {/* <html lang="en"> */}
      <body
        className={`antialiased overscroll-none w-screen h-screen flex flex-col items-center justify-center bg-background text-black dark:text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
