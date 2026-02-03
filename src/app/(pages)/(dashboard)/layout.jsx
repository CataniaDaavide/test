import { BottomNavigationBar } from "@/components/bottom-navigation-bar";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col p-3 md:p-6">
        <Navbar />
        {children}
        <BottomNavigationBar />
      </div>
    </>
  );
}
