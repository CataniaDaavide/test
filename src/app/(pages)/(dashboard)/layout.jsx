"use client";
import { BottomNavigationBar } from "@/components/bottom-navigation-bar";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({ children }) {
  const { user } = useUser();

  if (user == null) return;

  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        {children}
        <BottomNavigationBar />
      </div>
    </>
  );
}
