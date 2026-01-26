"use client";
import {  LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from "@/data/menu-items";
import { useError } from "@/context/ErrorContext";
import { ButtonBack } from "./button-back";

export function Navbar() {
  const pathname = usePathname();

  const currentItem = menuItems.find((item) => item.link === pathname);
  const title = currentItem?.title || "undefined";

  return (
    <div className="sticky w-full p-3 flex items-center justify-between">
      <div className="flex items-center justify-center">
        <ButtonBack className={"p-2"} />
        <div className="flex flex-col">
          <p>{title}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <ModeToggle />
        <Logout />
      </div>
    </div>
  );
}

//pulsante per fare il logout dell'account
function Logout() {
  const { setError } = useError();
  const router = useRouter();
  const handleLogout = (e) => {
    try {
      e.preventDefault();
      //TODO: aggiungere pulizia del context dell' utente

      //reinderizza alla pagina di login
      router.push("/login");
    } catch (e) {
      setError({
        title: "Errore",
        description: e.toString(),
        status: "error",
      });
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout}>
      <LogOut />
    </Button>
  );
}
