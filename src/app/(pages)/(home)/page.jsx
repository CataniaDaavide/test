"use client";
import { useState, useEffect } from "react";

//hoocks - functions - lib
import Link from "next/link";
// import { cookies } from "next/headers";

//components
import { ButtonLogout } from "@/app/components/ButtonLogout";
import { House, PanelLeft } from "lucide-react";
import { ButtonIcon } from "@/app/components/ui/buttonIcon";
import { base_exceptionManager } from "@/app/core/baseFunctions";

// export default async function Home() {
// export default function Home() {
//   // const cookieStore = await cookies();
//   // const sessionToken = cookieStore.get("sessionToken")?.value;

//   return (
//     <div className="flex flex-col gap-3 items-center justify-center">
//       <p className="text-2xl font-bold">Home</p>
//       {/* <div className="w-full max-w-md">
//         <p className="text-green-500 text-semibold break-all">{sessionToken}</p>
//       </div> */}
//       <Link href={"/test"} className="underline">
//         Test
//       </Link>
//       <ButtonLogout />
//     </div>
//   );
// }

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex items-center ">
      <Menu />
    </div>
  );
}

function Menu() {
  const tabs = [
    {
      title: "Home",
      icon: <House />,
      component: <div>Home component</div>,
    },
    {
      title: "Categorie",
      icon: <House />,
      component: <div>Categorie component</div>,
    },
    {
      title: "Movimenti",
      icon: <House />,
      component: <div>Movimenti component</div>,
    },
    {
      title: "Conti",
      icon: <House />,
      component: <div>Conti component</div>,
    },
    {
      title: "Profilo",
      icon: <House />,
      component: <div>Profilo component</div>,
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [sidebar, setSidebar] = useState(true);

  const toggleSidebar = (e) => {
    try {
      // e.preventDefault();
      console.log(1);

      setSidebar(!sidebar);
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <div className="w-full h-full flex">
      {/* sx */}
      <div
        className={`${
          sidebar ? "w-[250px]" : "w-[60px]"
        } border h-full bg-card border-border-card transition-all duration-500`}
      >
        <ul className="p-3 flex flex-col gap-1 items-center">
          {tabs.map((t, index) => {
            const { title, icon, component } = t;
            return (
              <li
                key={index}
                onClick={() => {
                  setActiveTab(tabs[index]);
                }}
                className={`rounded-md transition-all ${sidebar ? "w-full h-10 text-sm font-semibold px-4 py-2" : "h-10 w-10 flex items-center justify-center"} ${
                  activeTab.title === title
                    ? "bg-background-inverse text-white dark:text-black"
                    : "dark:text-white text-black hover:bg-background-inverse/10"
                } flex items-center gap-1 cursor-pointer`}
              >
                {icon}
                {sidebar && <span>{title}</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* dx */}
      <div className="h-14 w-full bg-card border border-l-0 border-border-card flex gap-3 items-center px-4">
        <button onClick={toggleSidebar} className="w-10 h-10flex items-center justify-center">
          <PanelLeft size={20} />
        </button>
        <span>Dashboard</span>
      </div>
    </div>
  );
}
