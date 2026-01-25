"use client"
import Link from "next/link";
import "./globals.css";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function NotFoundPage() {
  // const router = useRouter();

  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/");
  //   }, 5000);
  // }, []);

  return (
    <div className="bg-background w-screen h-screen flex flex-col items-center justify-center">
      <p className="text-5xl font-bold mb-1">404</p>
      <p className="text-xl font-bold mb-3">Pagina non trovata</p>
      <Link href="/" className="underline cursor-pointer">
        Ritorna alla home
      </Link>
    </div>
  );
}
