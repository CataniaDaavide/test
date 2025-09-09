"use client";
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
import { useEffect, useRef, useState } from "react";
import Select from "../select";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import EmojiPicker from "../emoji-picker";
import ColorPicker from "../color-picker";
import { fetchApi, formValidation } from "@/app/core/baseFunctions";

export default function ModalCategorie({ data, handleCloseModal }) {
  const { base_exceptionManager } = useExceptionManager();
  const [formValidationError, setFormValidationError] = useState({
    name: "",
    emoji: "",
    type: "",
    hexColor: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);
  const {
    _id,
    emoji: currentEmoji,
    hexColor: currentHexColor,
    status,
    type: currentType,
    name: currentName,
    userId,
    handleDelete,
  } = data;
  const title = _id ? "Modifica categoria" : "Creazione categoria";
  const description = "Crea una categoria per classificare entrate o uscite";
  const [error, setError] = useState();
  const [ name, setName ] = useState(currentName || "");
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

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
        name: {
          value: name,
          validators: {
            notEmpty: { message: "Nome obbligatorio" },
          },
        },
        emoji: {
          value: emoji,
          validators: {
            notEmpty: { message: "Emoji obbligatoria" },
          },
        },
        type: {
          value: type,
          validators: {
            notEmpty: { message: "Tipo obbligatorio" },
          },
        },
        hexColor: {
          value: hexColor,
          validators: {
            notEmpty: { message: "Colore obbligatorio" },
          },
        },
      };

      // Esegui validazione
      const hasError = formValidation(setFormValidationError, fields);
      return hasError;
    } catch (error) {
      base_exceptionManager(error);
    }
  }

  // evento che gestice gli errori della 
  // form validator quando i campi vengono compilati
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Solo se ci sono già errori
    const hasExistingErrors = Object.values(formValidationError).some(
      (error) => error !== ""
    );
    if (hasExistingErrors) {
      formValidationInit();
    }
  }, [ name, emoji, type, hexColor]);

  // click sul pulsante modifica o crea
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const hasError = formValidationInit();
      if (hasError) return exit();

      const requestData = {
        emoji: emoji,
        hexColor: hexColor,
        name: name,
        status: status ?? "A", //A = ATTIVO
        type: type?.value,
        userId: userId,
      };
      if (_id) {
        requestData._id = _id;
      }
      await fetchApi(
        "/api/categories/categorieEdit",
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

      exit();
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // funzione che rimuove il loader in caso di errori o uscita
  const exit = () => {
    setIsLoading(false);
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
          errorMessage={formValidationError.name}
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <EmojiPicker
          title={"Emoji"}
          required={true}
          errorMessage={formValidationError.emoji}
          value={emoji}
          setValue={setEmoji}
        />
        <Select
          title={"Tipo"}
          required={true}
          options={typesOptions}
          value={type}
          setValue={setType}
          errorMessage={formValidationError.type}
        />
        <ColorPicker
          title="Colore"
          required={true}
          value={hexColor}
          setValue={setHexColor}
          errorMessage={formValidationError.color}
        />
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
      </CardContent>

      <CardFooter className={"mt-3 pb-5 md:pb-0"}>
        {_id ? (
          <>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <span>Modifica</span>
            </Button>
            <Button
              onClick={handleDelete}
              color={"danger"}
              disabled={isLoading}
            >
              <span>Elimina</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            <span>Crea</span>
          </Button>
        )}
      </CardFooter>
    </>
  );
}
