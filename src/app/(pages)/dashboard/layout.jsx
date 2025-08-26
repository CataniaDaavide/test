"use client"
import HeaderMovbile from "@/app/components/ui/header-mobile";
import MenuMobile from "@/app/components/ui/menu-mobile";
import Sidebar, { Navbar } from "@/app/components/ui/sidebar";
import { SidebarProvider } from "@/app/context/SidebarContext";
import {
  ArrowUpDown,
  Folder,
  House,
  CreditCard,
  UserRound,
  Plus,
} from "lucide-react";
import { useState } from "react";

export const menuItems = [
  {
    title: "Home",
    icon: <House />,
    link: "/dashboard",
    menu:["mobile", "desktop"]
  },
  {
    title: "Categorie",
    icon: <Folder />,
    link: "/dashboard/categories",
    menu:["mobile", "desktop"]
  },
  {
    title: "add transiction",
    icon: <Plus />,
    action: () => {
      console.log("ciao")
    },
      menu:["mobile"]
  },
  {
    title: "Movimenti",
    icon: <ArrowUpDown />,
    link: "/dashboard/movements",
        menu:["mobile", "desktop"]
  },
  {
    title: "Conti",
    icon: <CreditCard />,
    link: "/dashboard/accounts",
      menu:["mobile", "desktop"]
  },
  {
    title: "Profilo",
    icon: <UserRound />,
    link: "/dashboard/profile",
      menu:["desktop"]
  },
];

export default function DashboardLayout({ children }) {
  const [expand, setExpand] = useState(true);

  const toggleSidebar = (e) => {
    e.preventDefault();
    setExpand((prev) => !prev);
  };

  return (
    <SidebarProvider>
      <div className="w-full h-full flex flex-col">
        {/* HEADER: visibile solo da mobile*/}
        <div className="flex w-full md:hidden h-16">
          <HeaderMovbile actions={["toggle-theme", "profile"]} />
        </div>

        {/* CONTENUTO PRINCIPALE */}
        <div className="flex-1 flex w-full h-full overflow-hidden">
          {/* Desktop: sidebar a sinistra */}
          <div className="hidden md:flex h-full bg-blue-200">
            <Sidebar items={menuItems} expand={expand} />
          </div>

          <main className="w-full h-full flex flex-col">
            {/* NAVBAR: visibile solo da desktop*/}
            <div className="hidden md:flex">
              <Navbar toggleSidebar={toggleSidebar}/>
            </div>

            {/* body della pagina */}
            <div className="w-full h-full overflow-auto">{children}</div>
          </main>
        </div>

        {/* MENU MOBILE: fisso sotto, visibile solo da mobile */}
        <div className="flex md:hidden w-full">
          <MenuMobile />
        </div>
      </div>
    </SidebarProvider>
  );
}
