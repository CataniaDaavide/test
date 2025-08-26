"use client";
import HeaderMovbile from "@/app/components/ui/header-mobile";
import MenuMobile from "@/app/components/ui/menu-mobile";
import Sidebar, { Navbar } from "@/app/components/ui/sidebar";
import { SidebarContext, SidebarProvider } from "@/app/context/SidebarContext";
import {
  ArrowUpDown,
  Folder,
  House,
  CreditCard,
  UserRound,
  Plus,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: <House />,
    link: "/dashboard",
    menu: ["mobile", "desktop"],
  },
  {
    title: "Categorie",
    icon: <Folder />,
    link: "/dashboard/categories",
    menu: ["mobile", "desktop"],
  },
  {
    title: "add transiction",
    icon: <Plus />,
    action: () => {
      console.log("ciao");
    },
    menu: ["mobile"],
  },
  {
    title: "Movimenti",
    icon: <ArrowUpDown />,
    link: "/dashboard/movements",
    menu: ["mobile", "desktop"],
  },
  {
    title: "Conti",
    icon: <CreditCard />,
    link: "/dashboard/accounts",
    menu: ["mobile", "desktop"],
  },
  {
    title: "Profilo",
    icon: <UserRound />,
    link: "/dashboard/profile",
    menu: ["desktop"],
  },
];

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardInner>{children}</DashboardInner>
    </SidebarProvider>
  );
}

export function DashboardInner({ children }) {
  const [expand, setExpand] = useState(true);
  const { activeTab, setActiveTab } = useContext(SidebarContext);

  useEffect(() => {
    // Aggiorna dinamicamente il titolo della pagina
    document.title = `${activeTab.title}`;
  }, []);

  const toggleSidebar = (e) => {
    e.preventDefault();
    setExpand((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* HEADER: visibile solo da mobile*/}
      <div className="flex w-full md:hidden h-16">
        <HeaderMovbile actions={["toggle-theme", "profile"]} />
      </div>

      <div className="flex w-full h-full overflow-hidden">
        {/* Desktop: sidebar a sinistra */}
        <div className="hidden md:flex h-full">
          <Sidebar items={menuItems} expand={expand} />
        </div>

        <div className="w-full h-full flex flex-col overflow-auto">
          {/* NAVBAR: visibile solo da desktop*/}
          <div className="hidden md:flex">
            <Navbar toggleSidebar={toggleSidebar} />
          </div>

          {/* body della pagina */}
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>

      {/* MENU MOBILE: fisso sotto, visibile solo da mobile */}
      <div className="flex md:hidden w-full">
        <MenuMobile />
      </div>
    </div>
  );
}
