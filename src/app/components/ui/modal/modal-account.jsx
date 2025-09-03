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
import { AccountsTypeOptions } from "@/app/(pages)/dashboard/accounts/page";

export default function ModalAccount({ data, handleCloseModal }) {
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
    amount: currentAmount,
    handleDelete,
  } = data;
  console.log(data, currentName);
  
  const title = _id ? "Modifica conto" : "Creazione conto";
  const description =
    "Crea un conto per organizzare le tue finanze in modo chiaro e semplice";
  const [error, setError] = useState();
  const [name, setName] = useState(currentName || "");
  const [amount, setAmount] = useState(currentAmount || 0.0);
  const [emoji, setEmoji] = useState(currentEmoji);
  const [type, setType] = useState(
    AccountsTypeOptions.find((x) => x.value === currentType)
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
        amount: {
          value: amount,
          validators: {
            notEmpty: { message: "Saldo iniziale obbligatorio" },
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
  }, [name, amount, emoji, type, hexColor]);

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
        amount: amount,
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          errorMessage={formValidationError.name}
        />
        <Input
          title={"Saldo iniziale"}
          required={true}
          type="tel"
          placeholder={"0,00"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          errorMessage={formValidationError.amount}
        />
        <EmojiPicker
          title={"Emoji"}
          required={true}
          value={emoji}
          setValue={setEmoji}
          errorMessage={formValidationError.emoji}
        />
        <Select
          title={"Tipo"}
          required={true}
          options={AccountsTypeOptions}
          value={type}
          setValue={setType}
          errorMessage={formValidationError.type}
        />
        <ColorPicker
          title="Colore"
          required={true}
          value={hexColor}
          setValue={setHexColor}
          errorMessage={formValidationError.hexColor}
        />
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
      </CardContent>

      <CardFooter className={"mt-3"}>
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
