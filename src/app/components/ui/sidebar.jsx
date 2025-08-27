"use client";
import { SidebarContext } from "@/app/context/SidebarContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ChevronsRight, PanelLeft, Wallet } from "lucide-react";
import { base_exceptionManager } from "@/app/core/baseFunctions";
import { menuItems } from "@/app/(pages)/dashboard/layout";
import ButtonToggleTheme from "./toggle-theme";
import { ButtonIcon, ButtonLogout } from "./button";

export default function Sidebar({ items }) {
  const router = useRouter();
  const { activeTab, setActiveTab } = useContext(SidebarContext);

  const [expand, setExpand] = useState(true);
  const toggleSidebar = (e) => {
    e.preventDefault();
    setExpand((prev) => !prev);
  };
  return (
    <div
      className={`
        h-full flex flex-col items-center justify-between p-3
        ${expand ? "w-[250px]" : "w-[60px]"}
        transition-all duration-300
      `}
    >
      <div className="w-full flex flex-col">
        <div className="relative w-full flex items-center justify-between mb-10">
          <LogoSidebar expand={expand} />
          <button
            onClick={toggleSidebar}
            className={`
              ${expand ? "rotate-180" : "absolute -right-10"}
              p-1 text-muted-foreground hover:text-background-inverse transition-all duration-300
            `}
          >
            <ChevronsRight size={24} />
          </button>
        </div>

        <ul
          className={`
            flex flex-col gap-1 w-full
            ${expand ? "items-start" : "items-center"}
          `}
        >
          {items
            .filter((item) => item.menu.includes("desktop"))
            .map((item, index) => {
              return (
                <ItemListSidebar
                  item={item}
                  key={index}
                  expand={expand}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  router={router}
                />
              );
            })}
        </ul>
      </div>
      <ButtonLogout color={"trasparent"} className="mb-10" />
    </div>
  );
}

function ItemListSidebar({ expand, item, activeTab, setActiveTab, router }) {
  const [hoverText, setHoverText] = useState(false);
  const { title, icon, link, action } = item;

  const handleClick = (e) => {
    try {
      setActiveTab(item);
      if (link) {
        router.push(link);
      }
      if (action) {
        action();
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <li
      className="relative w-full flex justify-center"
      onMouseEnter={() => {
        setHoverText(true);
      }}
      onMouseLeave={() => {
        setHoverText(false);
      }}
    >
      {!expand && hoverText && <HoverComponent title={title} />}
      <button
        onClick={handleClick}
        className={`
            flex items-center gap-3 rounded-lg cursor-pointer text-sm font-bold 
            ${
              expand ? "w-full h-10 px-4 py-2" : "!h-10 min-w-10 justify-center"
            }
            ${
              activeTab.title === title
                ? "bg-background-inverse text-background"
                : "dark:text-background-inverse hover:bg-background-inverse/10"
            }
          `}
      >
        {icon}
        <p className={expand ? "ml-1" : "hidden"}>{title}</p>
      </button>
    </li>
  );
}

function LogoSidebar({ expand }) {
  return (
    <div
      className={`
        w-full flex items-center font-bold
        transition-all duration-300 h-10
        ${expand ? "justify-center" : "justify-center"}
      `}
    >
      <Wallet size={24} />
      <p className={expand ? "ml-2 w-auto" : "w-0 overflow-hidden m-0"}>
        Expense Tracker
      </p>
    </div>
  );
}

export function Navbar({}) {
  const pathname = usePathname();

  const currentItem = menuItems.find((item) => item.link === pathname);
  const title = currentItem?.title || "undefined";

  return (
    <div
      className={`
        w-full flex items-center justify-between h-16
        p-3 px-10 font-bold text-sm   
      `}
    >
      {/* LEFT */}
      <p>{title}</p>

      {/* RIGHT */}
      <div className="flex items-center justify-center">
        <ButtonToggleTheme className={"!rounded-full"} color={"trasparent"} />
      </div>
    </div>
  );
}

function HoverComponent({ title = "undefined" }) {
  return (
    <div
      className={`
        absolute top-1/2 right-[-100px] -translate-y-1/2
        flex items-center justify-center
        bg-card border-border-card border
        min-w-20 px-3 py-1 
        rounded-xl text-xs
      `}
    >
      <p>{title}</p>
    </div>
  );
}
