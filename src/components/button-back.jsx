"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

//pulsante per tornare alla pagina precedente
export function ButtonBack({ className }) {
  const router = useRouter();

  // click sul pulsante per tornare alla pagina precedente
  const handleReturnBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div onClick={handleReturnBack} className={cn("cursor-pointer", className)}>
      <ChevronLeft />
    </div>
  );
}
