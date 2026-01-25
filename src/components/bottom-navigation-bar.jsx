// BottomNavigationBar.tsx
"use client";

import Link from "next/link";
import { menuItems } from "@/data/menu-items";
import { useLoader } from "@/context/LoaderContext";

export function BottomNavigationBar() {
  return (
    <div className="w-full flex md:hidden gap-3 items-center justify-evenly border-t h-20">
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
  const { title, icon: Icon, link, action } = item;

  if (action) {
    return (
      <button
        className="p-3 bg-card rounded-full cursor-pointer"
        onClick={() => action(setLoader)}
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
