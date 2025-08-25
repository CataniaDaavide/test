"use client";

import { useRouter } from "next/navigation";

//icons
import { ChevronLeft } from "lucide-react";
// import { ButtonIcon } from "./buttonIcon";

export default function ButtonBack({ className }) {
  const router = useRouter();
  
  // click sul pulsante per tornare alla pagina precedente
  const handleReturnBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <button onClick={handleReturnBack} className={`p-2 cursor-pointer ${className}`}>
      <ChevronLeft />
    </button>
  );
}
