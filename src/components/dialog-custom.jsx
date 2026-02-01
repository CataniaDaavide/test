"use client";

import { useDialogCustom } from "@/context/DialogCustomContext";
import { DialogCreateOrEditMovement } from "@/app/(pages)/(dashboard)/movements/page";

export default function DialogCustom() {
  const { dialog } = useDialogCustom();

  if (!dialog) return null;
  if (!dialog.show || !dialog.type || !dialog.data) return;
  switch (dialog.type) {
    case "movement":
      return <DialogCreateOrEditMovement />;

    default:
      return <DialogCreateOrEditMovement />;
  }
}
