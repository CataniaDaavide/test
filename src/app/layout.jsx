// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Template APP",
  description: "Template applicazione web nextjs + tailwindcss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
    {/* <html lang="en"> */}
      <body
        className={`antialiased overscroll-none w-screen h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-950 text-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
