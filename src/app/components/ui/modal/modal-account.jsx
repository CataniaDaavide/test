"use client";
import { TriangleAlert } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardTitle,
} from "../card";
import { Button } from "../button";
import Input from "../input";
import { useContext, useRef, useState } from "react";
import Select from "../select";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import EmojiPicker from "../emoji-picker";
import ColorPicker from "../color-picker";
import { ModalContext } from "@/app/context/ModalContext";
import { fetchApi } from "@/app/core/baseFunctions";
import { AccountsTypeOptions } from "@/app/(pages)/dashboard/accounts/page";

export default function ModalAccount({ data, handleCloseModal }) {
  const { base_exceptionManager } = useExceptionManager();
  // const { setModal } = useContext(ModalContext);
  const {
    _id,
    emoji: currentEmoji,
    hexColor: currentHexColor,
    status,
    type: currentType,
    name,
    userId,
    amount = 0.00,
    handleDelete,
  } = data;
  
  const title = _id ? "Modifica conto" : "Creazione conto";
  const description =
    "Crea un conto per organizzare le tue finanze in modo chiaro e semplice";
  const [error, setError] = useState();
  const nameRef = useRef();
  const amountRef = useRef();
  const [emoji, setEmoji] = useState(currentEmoji);
  const [type, setType] = useState(
    AccountsTypeOptions.find((x) => x.value === currentType)
  );
  const [hexColor, setHexColor] = useState(currentHexColor);

  // click sul pulsante modifica o crea
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const requestData = {
        emoji: emoji,
        hexColor: hexColor,
        name: nameRef.current.value,
        status: status ?? "A", //A = ATTIVO
        type: type?.value,
        userId: userId,
        amount: amountRef.current.value
      };
      if (_id) {
        requestData._id = _id;
      }
      await fetchApi(
        "/api/accounts/accountEdit",
        "POST",
        requestData,
        async (res) => {
          const data = await res.json();

          if (!res.ok && data.error != "") {
            setError(data.error);
          } else {
            handleCloseModal();
          }
        }
      );
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <>
      <CardHeader>
        <CardHeaderContent>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="overflow-scroll scrollbar-hide">
        <Input
          title={"Nome"}
          required={true}
          type="text"
          placeholder={"Inserisci nome"}
          defaultValue={name}
          ref={nameRef}
        />
        <Input
          title={"Saldo iniziale"}
          required={true}
          type="tel"
          placeholder={"0,00"}
          defaultValue={amount}
          ref={amountRef}
        />
        <EmojiPicker
          title={"Emoji"}
          required={true}
          value={emoji}
          setValue={setEmoji}
        />
        <Select
          title={"Tipo"}
          required={true}
          options={AccountsTypeOptions}
          value={type}
          setValue={setType}
        />
        <ColorPicker
          title="Colore"
          required={true}
          value={hexColor}
          setValue={setHexColor}
        />
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
      </CardContent>

      <CardFooter className={"mt-3"}>
        {_id ? (
          <>
            <Button onClick={handleSubmit}>
              <span>Modifica</span>
            </Button>
            <Button onClick={handleDelete} color={"danger"}>
              <span>Elimina</span>
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit}>
            <span>Crea</span>
          </Button>
        )}
      </CardFooter>
    </>
  );
}
