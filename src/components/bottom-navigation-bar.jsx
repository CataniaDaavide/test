// BottomNavigationBar.tsx
"use client";

import Link from "next/link";
import { menuItems } from "@/data/menu-items";
import { useLoader } from "@/context/LoaderContext";
import { useError } from "@/context/ErrorContext";
import { Description } from "@radix-ui/react-dialog";

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
  const { setLoader } = useLoader();
  const { setError } = useError();
  const { title, icon: Icon, link, action } = item;

  if (action) {
    return (
      <button
        className="p-3 bg-zinc-200 dark:bg-card rounded-full cursor-pointer"
        onClick={async () => {
          await action(setLoader);
          setError(
            {title:"Errore test", description:"Lorem Ipsum is a placeholder text commonly used in the design and publishing industry.", status:"info"},
          );
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
