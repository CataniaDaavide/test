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

export default function Header({}) {
  const pathname = usePathname();

  const currentItem = menuItems.find((item) => item.link === pathname);
  const title = currentItem?.title || "undefined";
  const description = currentItem?.description || "undefined";

  return (
    <>
      <div className="w-full flex md:hidden">
        <HeaderMobile
          title={title}
          description={description}
          actions={["toggle-theme", "profile"]}
        />
      </div>

      <div className="w-full hidden md:flex">
        <HeaderDesktop
          title={title}
          description={description}
          actions={["toggle-theme"]}
        />
      </div>
    </>
  );
}

function HeaderMobile({
  title = "undefined",
  description = "undefined",
  actions = [],
}) {
  return (
    <div className="p-3 w-full flex items-center justify-between border-b-1 border-border-card">
      <div className="flex items-center justify-center">
        <ButtonBack />
        <div className="flex flex-col">
          <p>{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <ActionButtons actions={actions} />
    </div>
  );
}

function HeaderDesktop({
  title = "undefined",
  description = "undefined",
  actions = [],
}) {
  return (
    <div
      className={`
        w-full flex items-center justify-between
        p-3 px-10
      `}
    >
      <div className="flex flex-col">
        <p className="font-bold text-2xl">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <ActionButtons actions={actions} />
    </div>
  );
}

// componente per le azioni in alto a sinistra
function ActionButtons({ actions = [] }) {
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
