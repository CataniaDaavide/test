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
import { convertDate } from "@/app/core/baseFunctions";
import Select from "../select";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";

export default function ModalTransiction({ data, handleCloseModal }) {
  const { base_exceptionManager } = useExceptionManager();
  const { movementData = {} } = data;
  const {
    _id,
    date,
    createAt,
    categorieId,
    accountOneId,
    amountOne,
    accountTwoId,
    amountTwo,
    description: movementDescription,
  } = movementData;
  const title = _id ? "Modifica movimento" : "Creazione movimento"  
  const description = "Registra una nuova entrata o uscita"
  const dateRef = useRef();
  const timeRef = useRef();
  const amountOneRef = useRef();
  const amountTwoRef = useRef();
  const descriptionRef = useRef();
  const [categorieValue, setCategorieValue] = useState();
  let categorieOptions = [
    {
      _id: "111",
      value: "categorie1",
    },
    {
      _id: "222",
      value: "categorie2",
    },
    {
      _id: "333",
      value: "categorie3",
    },
    {
      _id: "444",
      value: "categorie4",
    },
  ];

  const [accountOneValue, setAccountOneValue] = useState();
  const [accountTwoValue, setAccountTwoValue] = useState();
  let accountOneOptions = [
    {
      _id: "555",
      value: "account1",
      type: "BANK",
    },
    {
      _id: "666",
      value: "account2",
      type: "VOUCHER",
    },
    {
      _id: "777",
      value: "account3",
      type: "VOUCHER",
    },
    {
      _id: "888",
      value: "account4",
      type: "BANK",
    },
  ];
  const [accountTwoOptions, setAccountTwoOptions] = useState([]);
  const [isVoucher, setIsVoucher] = useState(false);

  const setDateAndTime = (dateAndTime = new Date().toISOString()) => {
    dateRef.current.value = convertDate(dateAndTime, "yyyy-MM-dd");
    timeRef.current.value = convertDate(dateAndTime, "HH:mm");
  };

  //initMovementData: evento che viene elaborato all render del componente la prima volta
  useEffect(() => {
    try {
      if (_id) {
        //edit
        setDateAndTime(date);
        setCategorieValue(
          categorieOptions.find((x) => x._id.toString() === categorieId)
        );
        const tempAccountOneValue = accountOneOptions.find(
          (x) => x._id.toString() === accountOneId
        );
        setAccountOneValue(tempAccountOneValue);
        amountOneRef.current.value = amountOne;

        if (tempAccountOneValue && tempAccountOneValue != {}) {
          const { type } = tempAccountOneValue;
          if (type && type.toString().trim().toUpperCase() === "VOUCHER") {
            setIsVoucher(true);
            const arr = accountOneOptions.filter(
              (x) => x?.type.toString().trim().toUpperCase() != "VOUCHER"
            );
            setAccountTwoOptions(arr);
            if (accountTwoId) {
              const tempAccounTwoValue = arr.find(
                (x) => x._id.toString() === accountTwoId
              );
              setAccountTwoValue(tempAccounTwoValue);
              // amountTwoRef.current.value = amountTwo;
            }
          } else {
            setIsVoucher(false);
          }
        }

        descriptionRef.current.value = movementDescription;
      } else {
        //create
        setDateAndTime();
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  }, []);

  // evento che imposta il valore al amount dell secondo conto se siamo in edit
  // e arriva un data contenente come primo conto un type "VOUCHER"
  useEffect(() => {
    if (amountTwo && isVoucher) {
      amountTwoRef.current.value = amountTwo;
    }
  }, [isVoucher]);

  // evento che viene elaborato ad ogni cambiamento di "accountOneValue" (valore della select "Conto1")
  useEffect(() => {
    try {
      if (accountOneValue && accountOneValue != {}) {
        const { type } = accountOneValue;
        if (type && type.toString().trim().toUpperCase() === "VOUCHER") {
          setIsVoucher(true);
          const arr = accountOneOptions.filter(
            (x) => x?.type.toString().trim().toUpperCase() != "VOUCHER"
          );
          setAccountTwoOptions(arr);
        } else {
          setIsVoucher(false);
        }
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  }, [accountOneValue]);

  // click sul pulsante modifica o crea
  const handleSubmit = (e) => {
    try {
      e.preventDefault();

      const requestData = {
        date: new Date(
          `${dateRef.current.value}T${timeRef.current.value}`
        ).toISOString(),
        createAt: createAt ?? new Date().toISOString(),
        categorieId: categorieValue._id.toString(),
        accountOneId: accountOneValue._id.toString(),
        amountOne: amountOneRef.current.value,
      };
      if (_id) {
        requestData._id = _id;
      }
      if (isVoucher) {
        if (accountTwoValue && accountTwoValue != {}) {
          requestData.accountTwoId = accountTwoValue._id.toString();
          requestData.amountTwo = amountTwoRef.current.value;
        }
      }
      if (description) {
        requestData.description = descriptionRef.current.value;
      }
      if (createAt) {
        requestData.updateAt = new Date().toISOString();
      }

      console.log(requestData);

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
      </CardHeader>

      <CardContent className="overflow-scroll scrollbar-hide">
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
