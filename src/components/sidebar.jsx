"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronLeft, Search as SearchIcon, Wallet, X } from "lucide-react";
import { menuItems } from "@/data/temp-data";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);

  const desktopItems = menuItems.filter(
    (item) =>
      item.menu.includes("desktop") &&
      item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="hidden md:flex h-screen">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 350 : "auto" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col justify-between bg-card border-r py-5"
      >
        <div className="flex flex-col gap-5 px-3">
          {/* Header */}
          <SidebarHeader open={open} setOpen={setOpen} />

          {/* Ricerca */}
          <SidebarSearch open={open} search={search} setSearch={setSearch} />

          {/* Menu */}
          <SidebarMenu menuItems={desktopItems} open={open} />
        </div>
      </motion.aside>
    </div>
  );
}

function SidebarHeader({ open, setOpen }) {
  return (
    <div className={cn("flex items-center justify-between", open && "gap-3")}>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="font-semibold"
        >
          ExpensiveTracker
        </motion.p>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "cursor-pointer rounded-md hover:bg-muted transition",
          open ? "p-1" : "p-3",
        )}
      >
        {open ? <ChevronLeft /> : <Wallet />}
      </button>
    </div>
  );
}

function SidebarSearch({ open, search, setSearch }) {
  return (
    <>
      {open ? (
        <Input
          id={"search"}
          iconLeft={<SearchIcon />}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          action={
            search?.length != 0 ? (
              <button
                className="cursor-pointer absolute right-3 text-muted-foreground hover:text-primary"
                onClick={() => setSearch("")}
              >
                <X />
              </button>
            ) : (
              <></>
            )
          }
          className="bg-secondary! hover:bg-secondary border-0 py-3"
        />
      ) : (
        <button className="p-3 w-fit rounded-lg text-center bg-secondary text-muted-foreground">
          <SearchIcon />
        </button>
      )}
    </>
  );
}

function SidebarMenu({ menuItems, open }) {
  const pathname = usePathname();

  return (
    <ul className="w-full flex flex-col">
      {menuItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <Link key={index} href={item.link}>
            <li
              className={cn(
                pathname == item.link && "bg-secondary!",
                "p-3 hover:bg-secondary rounded-lg flex",
                open && "gap-3",
              )}
            >
              <Icon />
              {open && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.p>
              )}
            </li>
          </Link>
        );
      })}
    </ul>
  );
}


