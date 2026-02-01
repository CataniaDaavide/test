"use client";
import { LogOut, UserRound } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useMessage } from "@/context/MessageContext";
import { ButtonBack } from "./button-back";
import Link from "next/link";
import { menuItems } from "@/data/temp-data";

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
        <Link href={"/profile"}>
          <Button variant="ghost" className={"hover:bg-transparent!"}>
            <UserRound />
          </Button>
        </Link>
      </div>
    </div>
  );
}

//pulsante per fare il logout dell'account
function Logout() {
  const { setError } = useMessage();
  const router = useRouter();
  
  const handleLogout = (e) => {
    try {
      e.preventDefault();
      // Cancella cookie sessionToken
      document.cookie = "sessionToken=; path=/; max-age=0;";

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
