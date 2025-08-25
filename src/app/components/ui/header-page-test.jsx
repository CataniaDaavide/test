"use client";

//hoocks - functions - lib
import { useRouter } from "next/navigation";

//icons
import { Tag, User } from "lucide-react";

//components
import ButtonToggleTheme from "./toggle-theme";
import ButtonBack from "./button/buttonBack";
import { ButtonIcon } from "./button/buttonIcon";
import { ButtonLogout } from "./button/ButtonLogout";
import { useContext } from "react";
import { SidebarContext } from "@/app/context/SidebarContext";

export default function HeaderPageTest({
  actions = [],
}) {

  const { activeTab, setActiveTab } = useContext(SidebarContext)
  const titlePage = activeTab?.title || "undefined"
  return (
    <div className="p-3 w-full flex items-center justify-between">
      <div className="flex items-center justify-center">
        <ButtonBack />
        <p>{titlePage}</p>
      </div>

      <ActionsButton actions={actions} />
    </div>
  );
}

// componente per le azioni in alto a sinistra
function ActionsButton({ actions = [] }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-1">
      {actions.map((action, index) => {
        switch (action) {
          case "toggle-theme":
            return (
              <ButtonToggleTheme
                key={index}
                className={"!rounded-full"}
                color={"trasparent"}
              />
            );

          case "profile":
            return (
              <ButtonIcon
                key={index}
                icon={<User />}
                fn={() => router.push("/profile")}
                className={"!rounded-full"}
                color={"trasparent"}
              />
            );

          case "logout":
            return (
              <ButtonLogout key={index}/>
            );

          default:
            return <></>;
        }
      })}
    </div>
  );
}
