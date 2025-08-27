"use client";
import Header from "@/app/components/ui/header";
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
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export const menuItems = [
  {
    title: "Dashboard",
    description: "Panoramica delle tue finanze personali",
    icon: <House />,
    link: "/dashboard",
    menu: ["mobile", "desktop"],
  },
  {
    title: "Categorie",
    description: "Gestisci le categorie per entrate e uscite",
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
    description: "Gestisci tutte le tue entrate e uscite",
    icon: <ArrowUpDown />,
    link: "/dashboard/movements",
    menu: ["mobile", "desktop"],
  },
  {
    title: "Conti",
    description: "Gestisci le tue fonti di denaro",
    icon: <CreditCard />,
    link: "/dashboard/accounts",
    menu: ["mobile", "desktop"],
  },
  {
    title: "Profilo",
    description: "Gestisci i tuoi obiettivi di risparmio",
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
  const pathname = usePathname();
  const [expand, setExpand] = useState(true);
  const { activeTab, setActiveTab } = useContext(SidebarContext);

  useEffect(() => {
    const tab = menuItems.find((item) => item?.link === pathname);
    const { title } = tab;

    // Aggiorna dinamicamente il titolo della pagina
    document.title = title;
    setActiveTab(tab);
  }, [pathname]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
      {/* Desktop: sidebar visibile solo da tablet in su*/}
      <div className="hidden md:flex h-full">
        <Sidebar items={menuItems} />
      </div>

      <div className="w-full h-full flex flex-col overflow-auto">
        <Header actions={["toggle-theme", "profile"]} />

        {/* body della pagina */}
        <div className="w-full h-full overflow-auto">{children}</div>
      </div>

      {/* MENU MOBILE: fisso sotto, visibile solo da mobile */}
      <div className="flex md:hidden w-full">
        <MenuMobile />
      </div>
    </div>
  );
}
