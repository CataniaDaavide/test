"use client";
import { useContext } from "react";
import { Card } from "../card";
import { ModalContext } from "@/app/context/ModalContext";
import ModalError from "./modal-error";
import ModalTransiction from "./modal-transiction";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ButtonIcon } from "../button";
import { X } from "lucide-react";
import ModalCategorie from "./modal-categorie";

export default function Modal() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);

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
    switch (modal.type) {
      case "error":
        ModalComponent = (
          <ModalError data={modal.data} handleCloseModal={handleCloseModal} />
        );
        break;

      case "transiction":
        ModalComponent = (
          <ModalTransiction
            data={modal.data}
            handleCloseModal={handleCloseModal}
          />
        );
        break;

      case "categorie":
        ModalComponent = (
          <ModalCategorie
            data={modal.data}
            handleCloseModal={handleCloseModal}
          />
        );
        break;

      default:
        ModalComponent = (
          <ModalError data={modal.data} handleCloseModal={handleCloseModal} />
        );
        break;
    }
  }

  return (
    <div
      className="absolute top-0 left-0 z-[999] w-[100dvw] h-[100dvh] flex items-center justify-center md:p-3 bg-black/50"
      onClick={handleOverlayClick}
    >
      <Card className="relative h-[100dvh] !overscroll-none !border-0 md:!border-1 md:h-auto !rounded-none md:!rounded-xl md:max-w-md !justify-start">
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
