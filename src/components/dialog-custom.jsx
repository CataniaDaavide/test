"use client";

import { useDialogCustom } from "@/context/DialogCustomContext";
import { DialogCreateOrEditMovement } from "@/app/(pages)/(dashboard)/movements/page";
import { DialogCreateOrEditCategory } from "@/app/(pages)/(dashboard)/categories/page";

export default function DialogCustom() {
  const { dialog } = useDialogCustom();

  if (!dialog) return null;
  if (!dialog.show || !dialog.type || !dialog.data) return;
  switch (dialog.type) {
    case "movement":
      return <DialogCreateOrEditMovement />;

    case "category":
      return <DialogCreateOrEditCategory/>;
    default:
      return <DialogCreateOrEditMovement />;
  }
}
