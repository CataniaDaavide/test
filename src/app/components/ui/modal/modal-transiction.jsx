"use client";
import { Calendar, Clock, X } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderActions,
  CardHeaderContent,
  CardTitle,
} from "../card";
import { Button, ButtonIcon } from "../button";
import Input from "../input";
import { useEffect, useRef, useState } from "react";
import { base_exceptionManager, convertDate } from "@/app/core/baseFunctions";
import Select from "../select";

export default function ModalTransiction({ data, handleCloseModal }) {
  const { title, description } = data;
  const dateRef = useRef();
  const timeRef = useRef();
  const amountRef = useRef();
  const amountTwoRef = useRef();
  const descriptionRef = useRef();
  const [categorieValue, setCategorieValue] = useState();
  let categorieOptions = [
    {
      value: "categorie1",
    },
    {
      value: "categorie2",
    },
    {
      value: "categorie3",
    },
    {
      value: "categorie4",
    },
  ];

  const [accountValue, setAccountValue] = useState();
  let accountOptions = [
    {
      value: "account1",
    },
    {
      value: "account2",
    },
    {
      value: "account3",
    },
    {
      value: "account4",
    },
  ];

  const setDateAndTime = (
    date = new Date().toISOString(),
    time = new Date().toISOString()
  ) => {
    dateRef.current.value = convertDate(date, "yyyy-MM-dd");
    timeRef.current.value = convertDate(time, "HH:mm");
  };

  useEffect(() => {
    setDateAndTime();
  }, []);

  // click sul pulsante modifica o crea
  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      handleCloseModal();
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // click sul pulsante elimina
  const handleDelete = (e) => {
    try {
      e.preventDefault();
      handleCloseModal();
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

        <CardHeaderActions className={"absolute top-3 right-3"}>
          <ButtonIcon
            onClick={handleCloseModal}
            icon={<X />}
            className={`hover:!bg-transparent !text-muted-foreground hover:!text-background-inverse transition-all duration-300`}
            color={"trasparent"}
          />
        </CardHeaderActions>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Input
            title={"Data"}
            required={true}
            type="date"
            icon={<Calendar />}
            ref={dateRef}
          />
          <Input
            title={"Orario"}
            required={true}
            type="time"
            icon={<Clock />}
            ref={timeRef}
          />
        </div>
        <Select
          title={"Categoria"}
          required={true}
          options={categorieOptions}
          value={categorieValue}
          setValue={setCategorieValue}
        />
        <Select
          title={"Conto"}
          required={true}
          options={accountOptions}
          value={accountValue}
          setValue={setAccountValue}
        />
        <Input title={"Importo (€)"} type="tel" ref={descriptionRef} />
        <Input
          title={"Descrizione"}
          type="textarea"
          placeholder={"Inserisci una descrizione"}
          ref={descriptionRef}
        />
      </CardContent>

      <CardFooter className={"md:mt-3"}>
        <Button onClick={handleSubmit}>
          <span>Modifica</span>
        </Button>
        <Button onClick={handleDelete} color={"danger"}>
          <span>Elimina</span>
        </Button>
        <Button onClick={handleSubmit}>
          <span>Crea</span>
        </Button>
      </CardFooter>
    </>
  );
}
