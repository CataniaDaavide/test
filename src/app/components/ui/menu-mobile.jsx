"use client";
import { menuItems } from "@/app/(pages)/dashboard/layout";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { SidebarContext } from "@/app/context/SidebarContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function MenuMobile() {
  const { base_exceptionManager } = useExceptionManager()
  const { activeTab, setActiveTab } = useContext(SidebarContext);

  return (
    <ul
      className={`
            w-full flex gap-3 items-center justify-evenly 
            border-t-1 border-border-card py-3
        `}
    >
      {menuItems
        .filter((item) => item.menu.includes("mobile"))
        .map((item, index) => {
          return (
            <ItemListMenuMobile
              key={index}
              item={item}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          );
        })}
    </ul>
  );
}

function ItemListMenuMobile({ item, activeTab, setActiveTab }) {
  const router = useRouter();
  const { title, icon, link, action } = item;
  const { setModal } = useContext(ModalContext);

  const handleClick = (e) => {
    try {
      e.preventDefault();
      setActiveTab(item);
      if (link) {
        router.push(link);
      }
      if (action) {
        action(setModal);
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`py-2 flex flex-col gap-1 items-center justify-center cursor-pointer`}
      >
        {action && (
          <div className="p-3 flex items-center justify-center rounded-full bg-card active:scale-95">
            {icon}
          </div>
        )}
        {link && (
          <div
            className={`${activeTab.title != title && "text-muted-foreground"} p-2`}
          >
            {icon}
          </div>
        )}

        {/* {link && <p className="text-xs">{title}</p>} */}
      </button>
    </li>
  );
}
