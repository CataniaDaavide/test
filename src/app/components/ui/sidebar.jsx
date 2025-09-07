"use client";
import { SidebarContext } from "@/app/context/SidebarContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ChevronsRight, Wallet } from "lucide-react";
import { fetchApi } from "@/app/core/baseFunctions";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import Badge from "./badge";

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
        ${expand ? "w-[250px]" : "w-[80px]"}
        transition-all duration-300 bg-card borderr-r-1 border-border-card
      `}
    >
      <div className="w-full flex flex-col">
        <div className={`relative w-full flex items-center justify-between mb-5 ${!expand && "flex-col"}`}>
          <LogoSidebar expand={expand} />
          <button
            onClick={toggleSidebar}
            className={`
              ${expand ? "rotate-180" : "hover:bg-background-inverse/10 rounded-lg"}
              p-1 text-muted-foreground hover:text-background-inverse transition-all duration-300 w-full max-w-14 h-14 flex items-center justify-center
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
    </div>
  );
}

function ItemListSidebar({ expand, item, activeTab, setActiveTab, router }) {
  const { base_exceptionManager } = useExceptionManager();
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
              expand ? "w-full h-10 px-4 py-2" : "!h-14 min-w-14 justify-center"
            }
            ${
              activeTab.title === title
                ? "bg-background-inverse/10 text-background-inverse"
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
        transition-all duration-300 h-14 text-nowrap
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

function HoverComponent({ title = "undefined" }) {
  return (
    <div
      className={`
        absolute top-1/2 -right-[120px] -translate-y-1/2
        flex items-start
      `}
    >
      <Badge className={`bg-border-card text-background-inverse !py-2`}>{title}</Badge>
    </div>
  );
}
