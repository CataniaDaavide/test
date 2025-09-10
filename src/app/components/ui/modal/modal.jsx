"use client";
import { useContext, useState } from "react";
import { Card } from "../card";
import { ModalContext } from "@/app/context/ModalContext";
import ModalTransiction from "./modal-transiction";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ButtonIcon } from "../button";
import { X } from "lucide-react";
import ModalCategorie from "./modal-categorie";
import ModalAlert from "./modal-alert";
import ModalAccount from "./modal-account";
import { motion } from "framer-motion";
import { ThemeContext } from "@/app/context/ThemeContext";

export default function Modal() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { show, type, data } = modal;
  const handleCloseModal = () => {
    try {
      setModal({
        show: false,
        type: "",
        data: {},
      });
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute("content", theme === "dark" ? "#09090b" : "#fafafa");
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const handleOverlayClick = (e) => {
    // Chiudi solo se il click è sull'overlay, non su elementi figli
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  if (!modal?.show) return null;

  // cambia il colore del theme_color (barra in alto) per i dispositivi mobile
  if (type != "alert") {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta.setAttribute("content", theme === "dark" ? "#18181b" : "#fdfdfd");
  }

  // Scegli il componente in base al tipo
  let ModalComponent = null;
  if (modal.type?.length) {
    switch (type) {
      case "alert":
        ModalComponent = <ModalAlert data={data} handleCloseModal={handleCloseModal} />;
        break;

      case "movement":
        ModalComponent = <ModalTransiction data={data} handleCloseModal={handleCloseModal} />;
        break;

      case "categorie":
        ModalComponent = <ModalCategorie data={data} handleCloseModal={handleCloseModal} />;
        break;

      case "account":
        ModalComponent = <ModalAccount data={data} handleCloseModal={handleCloseModal} />;
        break;

      default:
        ModalComponent = <ModalAlert data={data} handleCloseModal={handleCloseModal} />;
        break;
    }
  }

  return (
    <div
      className={`absolute top-0 left-0 z-[999] w-[100dvw] h-[100dvh] flex items-center justify-center bg-black/50 
      ${type === "alert" ? "p-3" : "md:p-3"}`}
      onClick={handleOverlayClick}
    >
      {/* <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute w-full flex items-center justify-center"
      > */}
      <Card
        className={`relative
            ${ 
              type === "alert"
                ? "w-full"
                : "w-screen h-[100dvh] md:!max-w-md md:!h-auto !rounded-none md:!rounded-xl border-0 md:!border-1"
            }`}
      >
        <ButtonIcon
          onClick={handleCloseModal}
          icon={<X />}
          className={`
            absolute top-3 right-3
            !rounded-full !text-muted-foreground hover:!text-background-inverse transition-all duration-300`}
          color={"transparent"}
        />
        {ModalComponent}
      </Card>
      {/* </motion.div> */}
    </div>
  );
}
