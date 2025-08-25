import HeaderPageTest from "@/app/components/ui/header-page-test";
import Sidebar from "@/app/components/ui/sidebar";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { House } from "lucide-react";

export const SidebarData = [
  {
    title: "Home",
    icon: <House />,
    link: "/dashboard",
  },
  {
    title: "Categorie",
    icon: <House />,
    link: "/dashboard/categories",
  },
  {
    title: "Movimenti",
    icon: <House />,
    link: "/dashboard/movements",
  },
  {
    title: "Conti",
    icon: <House />,
    link: "/dashboard/accounts",
  },
  {
    title: "Profilo",
    icon: <House />,
    link: "/dashboard/profile",
  },
];

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* HEADER: visibile sempre su mobile e desktop */}
      <div className="flex w-full md:hidden h-16 border-b">
        <HeaderPageTest actions={["toggle-theme", "profile"]} />
      </div>

      {/* CONTENUTO PRINCIPALE */}
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* Desktop: sidebar a sinistra */}
        <div className="hidden md:flex w-[350px] h-full bg-blue-200">
          Sidebar
        </div>

        {/* Body */}
        <main className="w-full h-full">
          {children}
        </main>
      </div>

      {/* MENU MOBILE: fisso sotto */}
      <div className="flex md:hidden w-full h-20 border-t">
        MenuMobile
      </div>
    </div>
  );
}

