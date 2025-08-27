"use client";

//hoocks - functions - lib
import { usePathname, useRouter } from "next/navigation";

//icons
import { Tag, User } from "lucide-react";

//components
import ButtonToggleTheme from "./toggle-theme";
import { ButtonBack } from "@/app/components/ui/button";
import { ButtonIcon } from "@/app/components/ui/button";
import { ButtonLogout } from "@/app/components/ui/button";
import { menuItems } from "@/app/(pages)/dashboard/layout";

export default function HeaderMovbile({ actions = [] }) {
  const pathname = usePathname();

  const currentItem = menuItems.find((item) => item.link === pathname);
  const title = currentItem?.title || "undefined";
  const description = currentItem?.description || "undefined";

  return (
    <div className="p-3 w-full flex items-center justify-between border-b-1 border-border-card">
      <div className="flex items-center justify-center">
        <ButtonBack />
        <div className="flex flex-col">
          <p>{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
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
                onClick={() => router.push("/dashboard/profile")}
                className={"!rounded-full"}
                color={"trasparent"}
              />
            );

          case "logout":
            return <ButtonLogout key={index} />;

          default:
            return <></>;
        }
      })}
    </div>
  );
}
