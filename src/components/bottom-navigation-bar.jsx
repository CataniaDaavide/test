// BottomNavigationBar.tsx
"use client";

import Link from "next/link";
import { useMessage } from "@/context/MessageContext";
import { useDialogCustom } from "@/context/DialogCustomContext";
import { menuItems } from "@/data/temp-data";

export function BottomNavigationBar() {
  return (
    <div className="w-full flex md:hidden gap-3 items-center justify-evenly border-t pt-2 pb-6">
      {menuItems
        .filter((item) => item.menu.includes("mobile"))
        .map((item, index) => (
          <BottomNavigationBarItem key={index} item={item} />
        ))}
    </div>
  );
}

function BottomNavigationBarItem({ item }) {
  const { setDialog } = useDialogCustom();
  const { setError } = useMessage();
  const { title, icon: Icon, link, action } = item;

  if (action) {
    return (
      <button
        className="p-3 bg-zinc-200 dark:bg-card rounded-full cursor-pointer"
        onClick={() => {
          action(setDialog);
        }}
      >
        <Icon />
      </button>
    );
  }

  return (
    <Link href={link} className="p-3">
      <Icon />
    </Link>
  );
}
