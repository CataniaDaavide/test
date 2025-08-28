"use client";
import { useContext } from "react";
import { Card } from "../card";
import { ModalContext } from "@/app/context/ModalContext";
import ModalError from "./modal-error";
import { base_exceptionManager } from "@/app/core/baseFunctions";
import ModalTransiction from "./modal-transiction";

export default function Modal() {
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
        ModalComponent = <ModalError data={modal.data} handleCloseModal={handleCloseModal} />;
        break;
      
        case "transiction":
        ModalComponent = <ModalTransiction data={modal.data} handleCloseModal={handleCloseModal} />;
        break;

        
      default:
        ModalComponent = <ModalError data={modal.data} handleCloseModal={handleCloseModal} />;
        break;
    }
  }

  return (
    <div
      className="absolute top-0 left-0 z-[999] w-[100dvw] h-[100dvh] flex items-center justify-center md:p-3 bg-black/50"
      onClick={handleOverlayClick} 
    >
      <Card className="h-full md:h-auto !rounded-none md:!rounded-xl md:max-w-md !justify-start">
        {ModalComponent}
      </Card>
    </div>
  );
}
