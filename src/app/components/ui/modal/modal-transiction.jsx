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
import { convertDate, fetchApi } from "@/app/core/baseFunctions";
import Select from "../select";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { AccountsTypeOptions } from "@/app/(pages)/dashboard/accounts/page";

export default function ModalTransiction({ data, handleCloseModal }) {
  const { base_exceptionManager } = useExceptionManager();
  const { movementData = {} } = data;
  const {
    _id,
    date: previusDate,
    createAt,
    categorieId,
    accountOneId,
    amountOne: previusAmountOne,
    accountTwoId,
    amountTwo: previusAmountTwo,
    description: previusDescription,
  } = movementData;
  const title = _id ? "Modifica movimento" : "Creazione movimento";
  const modalDescription = "Registra una nuova entrata o uscita";
  const [date, setDate] = useState(
    previusDate ? convertDate(previusDate, "yyyy-MM-dd") : convertDate(undefined, "yyyy-MM-dd")
  );
  const [isVoucher, setIsVoucher] = useState(false);
  const [time, setTime] = useState(previusDate ? convertDate(previusDate, "HH:mm") : convertDate(undefined, "HH:mm"));
  const [amountOne, setAmountOne] = useState(previusAmountOne || 0);
  const [amountTwo, setAmountTwo] = useState(previusAmountTwo || 0);
  const [description, setDescription] = useState(previusDescription || "");

  const [categories, setCategories] = useState();
  const [categorieValue, setCategorieValue] = useState();

  const [accounts, setAccounts] = useState();
  const [accountValue, setAccountValue] = useState();

  const [accountTwo, setAccountTwo] = useState();
  const [accountsTwoValue, setAccountsTwoValue] = useState();

  // recupero categorie
  const loadCategories = async () => {
    await fetchApi("/api/categories/categoriesGet", "POST", {}, async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        base_exceptionManager({ message: data.error });
        return;
      }

      const arr = [];
      const { categories } = data;
      categories.forEach((c) => {
        const { _id, emoji, name, type } = c;
        arr.push({
          _id: _id,
          label: `${emoji} ${name} - ${type === "E" ? "entrate" : "uscite"}`,
          value: name.toLowerCase(),
        });
      });
      setCategories(arr);
    });
  };

  // recupero conti
  const loadAccounts = async () => {
    await fetchApi("/api/accounts/accountsGet", "POST", {}, async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        base_exceptionManager({ message: data.error });
        return;
      }

      const arr = [];
      const { accounts } = data;
      
      accounts.forEach((c) => {
        const { _id, emoji, name, type } = c;
        const typeLabel = AccountsTypeOptions.find(x => x.value === type)?.label.slice(2).toLowerCase()
        arr.push({
          _id: _id,
          label: `${emoji} ${name} - ${typeLabel}`,
          value: name.toLowerCase(),
          type: type
        });
      });
      setAccounts(arr);
    });
  };

  useEffect(() => {
    loadCategories();
    loadAccounts();
  }, []);

  useEffect(() => {
    if (categories) {
      setCategorieValue(categories.find((x) => x._id.toString() === categorieId));
    }
    if (accounts) {
      setAccountValue(accounts.find((x) => x._id.toString() === accountOneId));
    }
  }, [categories, accounts]);

  //initMovementData: evento che viene elaborato all render del componente la prima volta
  // useEffect(() => {
  //   try {
  //     loadCategories();
  //     loadAccounts();

  //     if (_id) {
  //       //edit
  //       // if (tempAccountOneValue && tempAccountOneValue != {}) {
  //       //   const { type } = tempAccountOneValue;
  //       //   if (type && type.toString().trim().toUpperCase() === "VOUCHER") {
  //       //     setIsVoucher(true);
  //       //     const arr = accountOneOptions.filter((x) => x?.type.toString().trim().toUpperCase() != "VOUCHER");
  //       //     setAccountTwoOptions(arr);
  //       //     if (accountTwoId) {
  //       //       const tempAccounTwoValue = arr.find((x) => x._id.toString() === accountTwoId);
  //       //       setAccountTwoValue(tempAccounTwoValue);
  //       //       // amountTwoRef.current.value = amountTwo;
  //       //     }
  //       //   } else {
  //       //     setIsVoucher(false);
  //       //   }
  //       // }
  //     } else {
  //       //create
  //       setDateAndTime();
  //     }
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // }, []);

  // evento che imposta il valore al amount dell secondo conto se siamo in edit
  // e arriva un data contenente come primo conto un type "VOUCHER"
  // useEffect(() => {
  //   if (amountTwo && isVoucher) {
  //     amountTwoRef.current.value = amountTwo;
  //   }
  // }, [isVoucher]);

  // evento che viene elaborato ad ogni cambiamento di "accountValue" (valore della select "Conto1")
  useEffect(() => {
    try {
      if (accountValue && accountValue != {}) {
        const { type } = accountValue;
        if (type && type.toString().trim().toUpperCase() === "V") {
          setIsVoucher(true);
          setAccountTwo(accounts.filter((x) => x?.type.toString().trim().toUpperCase() != "V"));
        } else {
          setIsVoucher(false);
        }
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  }, [accountValue]);

  // click sul pulsante modifica o crea
  const handleSubmit = (e) => {
    try {
      e.preventDefault();

      const requestData = {
        date: new Date(`${dateRef.current.value}T${timeRef.current.value}`).toISOString(),
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
          {modalDescription && <CardDescription>{modalDescription}</CardDescription>}
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="overflow-scroll scrollbar-hide">
        <div className="grid grid-cols-2 gap-3">
          <Input
            title={"Data"}
            required={true}
            type="date"
            icon={<Calendar />}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            title={"Orario"}
            required={true}
            type="time"
            icon={<Clock />}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <Select
          title={"Categoria"}
          required={true}
          options={categories}
          value={categorieValue}
          setValue={setCategorieValue}
        />
        <Select
          title={isVoucher ? "Conto1" : "Conto"}
          required={true}
          options={accounts}
          value={accountValue}
          setValue={setAccountValue}
        />
         <Input title={isVoucher ? "Importo conto1 (€)" : "Importo (€)"} type="tel" value={amountOne} onChange={(e) => setAmountOne(e.target.value)} />
        {isVoucher && (
          <>
            <Select
              title={"Conto2"}
              required={true}
              options={accountTwo}
              value={accountsTwoValue}
              setValue={setAccountsTwoValue}
            />
            <Input title={"Importo conto2 (€)"} type="tel" value={amountTwo} onChange={(e) => setAccountTwo(e.target.value)} />
          </>
        )}
        <Input title={"Descrizione"} type="textarea" placeholder={"Inserisci una descrizione"} value={description} onChange={(e) => setAmountTwo(e.target.value)} />
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
