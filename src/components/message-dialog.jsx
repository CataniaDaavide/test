"use client";

import { useMessage } from "@/context/MessageContext";
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

export default function MessageDialog() {
  const { message, setMessage } = useMessage();

  if (!message) return null;

  return (
    <Dialog
      open={!!message}
      onOpenChange={(open) => {
        if (!open) setMessage(null);
      }}
    >
      <DialogContent
        className="sm:max-w-125 max-h-[70vh] flex flex-col gap-5"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Icona */}
        <div className="w-full flex justify-center">
          <MessageDialogIcon status={message.status} />
        </div>

        {/* Titolo */}
        <div className="w-full flex justify-center">
          <DialogTitle>{message.title}</DialogTitle>
        </div>

        {/* Descrizione scrollabile */}
        <ScrollArea className="flex flex-col gap-4 overflow-y-auto pr-3">
          <DialogDescription className={"text-wrap break-all pr-1"}>
            {message.description}
          </DialogDescription>
        </ScrollArea>

        {/* Footer fisso con azioni */}
        <DialogFooter className="flex flex-wrap gap-2">
          {message.actions?.map((action, index) => (
            <DialogClose asChild key={index}>
              {action}
            </DialogClose>
          ))}

          {/* Pulsante chiudi di default se non ci sono azioni */}
          {!message.actions?.length && (
            <DialogClose asChild>
              <Button variant="outline">Chiudi</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Funzione per scegliere icona e colori in base allo status
function MessageDialogIcon({ status }) {
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
