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

export default function ModalCategorie({ data, handleCloseModal }) {
  const { base_exceptionManager } = useExceptionManager();
  const { _id, emoji, hexColor, status, type, name, userId } = data;
  console.log("aaa", _id, emoji, hexColor, status, type, name, userId);
  const title = _id ? "Modifica categoria" : "Creazione categoria";
  const description = "Crea una categoria per classificare entrate o uscite";
  const nameRef = useRef();
  const [typeValue, setTypeValue] = useState();
  let typeOptions = [
    {
      _id: "111",
      label: "Entrata",
      value: "E",
    },
    {
      _id: "222",
      label: "Uscita",
      value: "U",
    },
  ];

  // //initMovementData: evento che viene elaborato all render del componente la prima volta
  // useEffect(() => {
  //   try {
  //     if (_id) {
  //       //edit
  //       setDateAndTime(date);
  //       setCategorieValue(
  //         categorieOptions.find((x) => x._id.toString() === categorieId)
  //       );
  //       const tempAccountOneValue = accountOneOptions.find(
  //         (x) => x._id.toString() === accountOneId
  //       );
  //       setAccountOneValue(tempAccountOneValue);
  //       amountOneRef.current.value = amountOne;

  //       if (tempAccountOneValue && tempAccountOneValue != {}) {
  //         const { type } = tempAccountOneValue;
  //         if (type && type.toString().trim().toUpperCase() === "VOUCHER") {
  //           setIsVoucher(true);
  //           const arr = accountOneOptions.filter(
  //             (x) => x?.type.toString().trim().toUpperCase() != "VOUCHER"
  //           );
  //           setAccountTwoOptions(arr);
  //           if (accountTwoId) {
  //             const tempAccounTwoValue = arr.find(
  //               (x) => x._id.toString() === accountTwoId
  //             );
  //             setAccountTwoValue(tempAccounTwoValue);
  //             // amountTwoRef.current.value = amountTwo;
  //           }
  //         } else {
  //           setIsVoucher(false);
  //         }
  //       }

  //       descriptionRef.current.value = movementDescription;
  //     } else {
  //       //create
  //       setDateAndTime();
  //     }
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // }, []);

  // // evento che imposta il valore al amount dell secondo conto se siamo in edit
  // // e arriva un data contenente come primo conto un type "VOUCHER"
  // useEffect(() => {
  //   if (amountTwo && isVoucher) {
  //     amountTwoRef.current.value = amountTwo;
  //   }
  // }, [isVoucher]);

  // // evento che viene elaborato ad ogni cambiamento di "accountOneValue" (valore della select "Conto1")
  // useEffect(() => {
  //   try {
  //     if (accountOneValue && accountOneValue != {}) {
  //       const { type } = accountOneValue;
  //       if (type && type.toString().trim().toUpperCase() === "VOUCHER") {
  //         setIsVoucher(true);
  //         const arr = accountOneOptions.filter(
  //           (x) => x?.type.toString().trim().toUpperCase() != "VOUCHER"
  //         );
  //         setAccountTwoOptions(arr);
  //       } else {
  //         setIsVoucher(false);
  //       }
  //     }
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // }, [accountOneValue]);

  // // click sul pulsante modifica o crea
  const handleSubmit = (e) => {
    try {
      e.preventDefault();

      //     const requestData = {
      //       date: new Date(
      //         `${dateRef.current.value}T${timeRef.current.value}`
      //       ).toISOString(),
      //       createAt: createAt ?? new Date().toISOString(),
      //       categorieId: categorieValue._id.toString(),
      //       accountOneId: accountOneValue._id.toString(),
      //       amountOne: amountOneRef.current.value,
      //     };
      //     if (_id) {
      //       requestData._id = _id;
      //     }
      //     if (isVoucher) {
      //       if (accountTwoValue && accountTwoValue != {}) {
      //         requestData.accountTwoId = accountTwoValue._id.toString();
      //         requestData.amountTwo = amountTwoRef.current.value;
      //       }
      //     }
      //     if (description) {
      //       requestData.description = descriptionRef.current.value;
      //     }
      //     if (createAt) {
      //       requestData.updateAt = new Date().toISOString();
      //     }

      //     console.log(requestData);

      //     handleCloseModal();
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
        <Input
          title={"Nome"}
          required={true}
          type="text"
          defaultValue={name}
          // icon={<Calendar />}
          ref={nameRef}
        />
        <p className="text-red-600 self-center">aggiungere componente EMOJI</p>
        <Select
          title={"Tipo"}
          required={true}
          options={typeOptions}
          value={typeValue}
          setValue={setTypeValue}
        />
        <p className="text-red-600 self-center">aggiungere componente COLORE</p>
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
