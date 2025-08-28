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
  const amountOneRef = useRef();
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
  
  const [accountOneValue, setAccountOneValue] = useState();
  const [accountTwoValue, setAccountTwoValue] = useState();
  let accountOneOptions = [
    {
      value: "account1",
      type: "BANK",
    },
    {
      value: "account2",
      type: "VOUCHER",
    },
    {
      value: "account3",
      type: "VOUCHER",
    },
    {
      value: "account4",
      type: "BANK",
    },
  ];
  const [accountTwoOptions, setAccountTwoOptions] = useState([]);
  const [isVoucher, setIsVoucher] = useState(false);

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

  useEffect(() => {
    if (accountOneValue && accountOneValue != {}) {
      const { type } = accountOneValue;
      if (type && type.toString().trim().toUpperCase() === "VOUCHER") {
        setIsVoucher(true);
        const arr = accountOneOptions.filter(
          (x) => x?.type.toString().trim().toUpperCase() != "VOUCHER"
        );
        setAccountTwoOptions(arr);
      }else{
        setIsVoucher(false)
      }
    }
  }, [accountOneValue]);

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
          title={isVoucher ? "Conto1" : "Conto"}
          required={true}
          options={accountOneOptions}
          value={accountOneValue}
          setValue={setAccountOneValue}
        />
        <Input
          title={isVoucher ? "Importo conto1 (€)" : "Importo (€)"}
          type="tel"
          ref={amountOneRef}
        />
        {isVoucher && (
          <>
            <Select
              title={"Conto2"}
              required={true}
              options={accountTwoOptions}
              value={accountTwoValue}
              setValue={setAccountTwoValue}
            />
            <Input title={"Importo conto2 (€)"} type="tel" ref={amountTwoRef} />
          </>
        )}
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
