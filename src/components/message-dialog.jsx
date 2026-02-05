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
        className="sm:max-w-125 max-h-[70vh] flex flex-col gap-5 p-0! overflow-hidden"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Header message={message} />

        {/* Descrizione scrollabile */}
        <ScrollArea className="flex flex-col gap-4 overflow-y-auto px-6!">
          <DialogDescription className={"text-wrap break-all pr-1"}>
            {message.description}
          </DialogDescription>
        </ScrollArea>

        {/* Footer fisso con azioni */}
        <DialogFooter className="flex flex-wrap gap-2 p-6 pt-0">
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

function Header({ message }) {
  return (
    <div className="w-full h-20 relative">
      <div className="absolute -top-8 -left-8 w-16 h-16 border-5 border-border/30 rounded-full"></div>
      <div className="absolute -top-16 -left-16 w-32 h-32 border-5 border-border/30 rounded-full"></div>
      <div className="absolute -top-26 -left-26 w-52 h-52 border-5 border-border/30 rounded-full"></div>
      <div className="absolute w-full flex items-center gap-3 p-6">
        <MessageDialogIcon status={message.status} />
        <DialogTitle>{message.title}</DialogTitle>
      </div>
    </div>
  );
}

// Funzione per scegliere icona e colori in base allo status
function MessageDialogIcon({ status }) {
  switch (status) {
    case "info":
      return <Info className="h-12 w-12 text-blue-500" />;
    case "success":
      return <CheckCircle className="h-12 w-12 text-green-500" />;
    case "warning":
      return <TriangleAlert className="h-12 w-12 text-yellow-500" />;
    case "error":
    default:
      return <TriangleAlert className="h-12 w-12 text-red-500" />;
  }
}

// ====================================================================================

// "use client";

// import { useMessage } from "@/context/MessageContext";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { CheckCircle, TriangleAlert, Info } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function MessageDialog() {
//   const { message, setMessage } = useMessage();

//   if (!message) return null;

//   return (
//     <Dialog
//       open={!!message}
//       onOpenChange={(open) => {
//         if (!open) setMessage(null);
//       }}
//     >
//       <DialogContent
//         className="sm:max-w-125 max-h-[70vh] flex flex-col gap-5"
//         showCloseButton={false}
//         onInteractOutside={(e) => e.preventDefault()}
//       >
//         {/* Icona */}
//         <div className="w-full flex justify-center">
//           <MessageDialogIcon status={message.status} />
//         </div>

//         {/* Titolo */}
//         <div className="w-full flex justify-center">
//           <DialogTitle>{message.title}</DialogTitle>
//         </div>

//         {/* Descrizione scrollabile */}
//         <ScrollArea className="flex flex-col gap-4 overflow-y-auto pr-3">
//           <DialogDescription className={"text-wrap break-all pr-1"}>
//             {message.description}
//           </DialogDescription>
//         </ScrollArea>

//         {/* Footer fisso con azioni */}
//         <DialogFooter className="flex flex-wrap gap-2">
//           {message.actions?.map((action, index) => (
//             <DialogClose asChild key={index}>
//               {action}
//             </DialogClose>
//           ))}

//           {/* Pulsante chiudi di default se non ci sono azioni */}
//           {!message.actions?.length && (
//             <DialogClose asChild>
//               <Button variant="outline">Chiudi</Button>
//             </DialogClose>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Funzione per scegliere icona e colori in base allo status
// function MessageDialogIcon({ status }) {
//   switch (status) {
//     case "info":
//       return <Info className="h-12 w-12 text-blue-500" />;
//     case "success":
//       return <CheckCircle className="h-12 w-12 text-green-500" />;
//     case "warning":
//       return <TriangleAlert className="h-12 w-12 text-yellow-500" />;
//     case "error":
//     default:
//       return <TriangleAlert className="h-12 w-12 text-red-500" />;
//   }
// }
