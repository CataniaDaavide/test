"use client";
import { useContext } from "react";
import { Card } from "../card";
import { ModalContext } from "@/app/context/ModalContext";
import ModalTransiction from "./modal-transiction";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ButtonIcon } from "../button";
import { X } from "lucide-react";
import ModalCategorie from "./modal-categorie";
import ModalAlert from "./modal-alert";

export default function Modal() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const { show , type, data } = modal
  const handleCloseModal = () => {
    try {
      setModal({
        show: false,
        type: "",
        data: {},
      });
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

  // Scegli il componente in base al tipo
  let ModalComponent = null;
  if (modal.type?.length) {
    switch (type) {
      case "alert":
        ModalComponent = (
          <ModalAlert data={data} handleCloseModal={handleCloseModal} />
        );
        break;

      case "transiction":
        ModalComponent = (
          <ModalTransiction
            data={data}
            handleCloseModal={handleCloseModal}
          />
        );
        break;

      case "categorie":
        ModalComponent = (
          <ModalCategorie
            data={data}
            handleCloseModal={handleCloseModal}
          />
        );
        break;

      default:
        ModalComponent = (
          <ModalAlert data={data} handleCloseModal={handleCloseModal} />
        );
        break;
    }
  }

  return (
    <div
      className={`absolute top-0 left-0 z-[999] w-[100dvw] h-[100dvh] flex items-center justify-center ${type === "alert" ? "p-3" : "md:p-3"} bg-black/50`}
      onClick={handleOverlayClick}
    >
      <Card className={`relative md:!max-w-md md:!h-auto ${type === "alert" ? "max-w-md" : "h-[100dvh] !rounded-none md:!rounded-xl !border-0 md:!border-1 "}`}>
        <ButtonIcon
          onClick={handleCloseModal}
          icon={<X />}
          className={`
              absolute top-3 right-3
              !rounded-full !text-muted-foreground hover:!text-background-inverse transition-all duration-300`}
          color={"trasparent"}
        />
        {ModalComponent}
      </Card>
    </div>
  );
}
