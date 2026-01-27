"use client";

import { useDialogCustom } from "@/context/DialogCustomContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DialogCustom() {
  const { dialog, setDialog } = useDialogCustom();

  if (!dialog) return null;

  return (
    <Dialog
      open={!!dialog}
      onOpenChange={(open) => {
        if (!open) setDialog(null);
      }}
    >
      <DialogContent className={cn(
        "flex flex-col overflow-hidden",
        "min-w-full sm:min-w-lg sm:max-w-lg",
        "h-full sm:max-h-[80vh]",
        "border-0 sm:border! rounded-none! sm:rounded-md!",
      )}>
        {/* Header fisso */}
        <DialogHeader className="text-start">
          {dialog.title && <DialogTitle>{dialog.title}</DialogTitle>}
          {dialog.description && (
            <DialogDescription>{dialog.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Contenuto scrollabile */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full overflow-y-auto pr-3">
            {dialog.content}
          </ScrollArea>
        </div>

        {/* Footer fisso */}
        <DialogFooter className={"grid grid-cols-2 gap-3"}>
          {dialog.actions ?? (
            <DialogClose asChild>
              <Button variant="outline">Chiudi</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
