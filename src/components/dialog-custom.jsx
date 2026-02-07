"use client";

import { useDialogCustom } from "@/context/DialogCustomContext";
import { DialogCreateOrEditMovement } from "@/app/(pages)/(dashboard)/movements/page";
import { DialogCreateOrEditCategory } from "@/app/(pages)/(dashboard)/categories/page";
import { DialogCreateOrEditAccount } from "@/app/(pages)/(dashboard)/accounts/page";
import { DialogEditProfile } from "@/app/(pages)/(dashboard)/profile/page";

export default function DialogCustom() {
  const { dialog } = useDialogCustom();

  if (!dialog) return null;
  if (!dialog.show || !dialog.type || !dialog.data) return;
  switch (dialog.type) {
    case "movement":
      return <DialogCreateOrEditMovement />;

    case "category":
      return <DialogCreateOrEditCategory/>;
      
    case "account":
      return <DialogCreateOrEditAccount/>;

      case "profile":
      return <DialogEditProfile/>;

    default:
      return <DialogCreateOrEditMovement />;
  }
}
