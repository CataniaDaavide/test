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

export default function ModalCategorie({ data, handleCloseModal }) {
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
    handleDelete,
  } = data;
  const title = _id ? "Modifica categoria" : "Creazione categoria";
  const description = "Crea una categoria per classificare entrate o uscite";
  const [error, setError] = useState();
  const nameRef = useRef();
  const [emoji, setEmoji] = useState(currentEmoji);
  let typesOptions = [
    {
      label: "Uscita",
      value: "U",
    },
    {
      label: "Entrata",
      value: "E",
    },
  ];
  const [type, setType] = useState(
    typesOptions.find((x) => x.value === currentType)
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
      };
      if (_id) {
        requestData._id = _id;
      }
      await fetchApi(
        "/api/categories/categorie-edit",
        "POST",
        requestData,
        async (res) => {
          const data = await res.json();
          console.log(res.ok, data);

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
        <EmojiPicker
          title={"Emoji"}
          required={true}
          value={emoji}
          setValue={setEmoji}
        />
        <Select
          title={"Tipo"}
          required={true}
          options={typesOptions}
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
