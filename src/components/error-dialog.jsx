"use client";

import { useError } from "@/context/ErrorContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, TriangleAlert, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ErrorDialog() {
  const { error, setError } = useError();

  if (!error) return null;

  /*
  {
    status: info | success | error | warning
    title: ""
    description: ""
  }
  */

  return (
    <Dialog
      open={!!error}
      onOpenChange={(open) => {
        if (!open) setError(null);
      }}
    >
      <DialogContent
        className="sm:max-w-125 max-h-[70vh] flex flex-col gap-5"
        showCloseButton={false} // disattiva x per chiudere il dialog in alto a destra
        onInteractOutside={(e) => e.preventDefault()} //disabilita click fuori dal dialog
      >
        {/* Contenuto scrollabile */}
        {/* Icona */}
        <div className="w-full flex justify-center">
          <ErrorDialogIcon status={error.status} />
        </div>
        {/* Titolo */}
        <div className="w-full flex justify-center">
          <DialogTitle>{error.title}</DialogTitle>
        </div>

        {/* Descrizione scrollabile */}
        <ScrollArea className="flex flex-col gap-4 overflow-y-auto pr-3">
          <DialogDescription className={"text-wrap break-all pr-1"}>
            {error.description}
          </DialogDescription>
        </ScrollArea>

        {/* Footer fisso */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Chiudi</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Funzione per scegliere icona e colori in base allo status
function ErrorDialogIcon({ status }) {
  switch (status) {
    case "info":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Info className="h-6 w-6 text-blue-600" />
        </div>
      );
    case "success":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
      );
    case "warning":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <TriangleAlert className="h-6 w-6 text-yellow-600" />
        </div>
      );
    case "error":
    default:
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <TriangleAlert className="h-6 w-6 text-red-600" />
        </div>
      );
  }
}
