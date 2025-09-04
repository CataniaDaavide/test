"use client";
import { Calendar, Clock } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderActions,
  CardHeaderContent,
  CardTitle,
} from "../card";
import { Button } from "../button";
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
  const isFirstRender = useRef(true);
  const [formValidationError, setFormValidationError] = useState({
    date: "",
    time: "",
    categorie: "",
    accountOne: "",
    amountOne: "",
    accountTwo: "",
    amountTwo: "",
  });
  const [isVoucher, setIsVoucher] = useState(false);
  const [time, setTime] = useState(previusDate ? convertDate(previusDate, "HH:mm") : convertDate(undefined, "HH:mm"));
  const [description, setDescription] = useState(previusDescription || "");
  
  const [categories, setCategories] = useState();
  const [categorieValue, setCategorieValue] = useState();
  
  const [accounts, setAccounts] = useState();
  const [accountValue, setAccountValue] = useState();
  const [amountOne, setAmountOne] = useState(previusAmountOne || 0);
  
  const [accountTwo, setAccountTwo] = useState();
  const [accountTwoValue, setaccountTwoValue] = useState();
  const [amountTwo, setAmountTwo] = useState(previusAmountTwo || 0);

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
        const typeLabel = AccountsTypeOptions.find((x) => x.value === type)
          ?.label.slice(2)
          .toLowerCase();
        arr.push({
          _id: _id,
          label: `${emoji} ${name} - ${typeLabel}`,
          value: name.toLowerCase(),
          type: type,
        });
      });
      setAccounts(arr);
    });
  };

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
        date: {
          value: date,
          validators: {
            notEmpty: { message: "Data obbligatorio" },
          },
        },
        time: {
          value: time,
          validators: {
            notEmpty: { message: "Orario obbligatorio" },
          },
        },
        categorieValue: {
          value: categorieValue,
          validators: {
            notEmpty: { message: "Categoria obbligatoria" },
          },
        },
        accountOne: {
          value: accountOne,
          validators: {
            notEmpty: { message: "Conto1 obbligatorio" },
          },
        },
        amount: {
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
    const hasExistingErrors = Object.values(formValidationError).some((error) => error !== "");
    if (hasExistingErrors) {
      formValidationInit();
    }
  }, [date, time, categorieValue, accountValue, amountOne, accountTwo, amountTwo]);

  // recupero dati
  useEffect(() => {
    loadCategories();
    loadAccounts();
  }, []);

  // init value categorie e account
  useEffect(() => {
    if (categories) {
      setCategorieValue(categories.find((x) => x._id.toString() === categorieId));
    }
    if (accounts) {
      setAccountValue(accounts.find((x) => x._id.toString() === accountOneId));
    }
  }, [categories, accounts]);

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

      const hasError = formValidationInit();
      if (hasError) return exit();

      const requestData = {
        date: new Date(`${date}T${time}`).toISOString(),
        createAt: createAt ?? new Date().toISOString(),
        categorieId: categorieValue._id.toString(),
        accountOneId: accountValue._id.toString(),
        amountOne: amountOne,
      };
      if (_id) {
        requestData._id = _id;
      }
      if (isVoucher) {
        if (accountTwo && accountTwo != {}) {
          requestData.accountTwoId = accountTwoValue._id.toString();
          requestData.amountTwo = amountTwo;
        }
      }
      if (description) {
        requestData.description = description;
      }
      if (createAt) {
        requestData.updateAt = new Date().toISOString();
      }

      console.log(requestData);

      // handleCloseModal();
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
            errorMessage={formValidationError.date}
            />
          <Input
            title={"Orario"}
            required={true}
            type="time"
            icon={<Clock />}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            errorMessage={formValidationError.time}
            />
        </div>
        <Select
          title={"Categoria"}
          required={true}
          options={categories}
          value={categorieValue}
          setValue={setCategorieValue}
          errorMessage={formValidationError.categorie}
          />
        <Select
          title={isVoucher ? "Conto1" : "Conto"}
          required={true}
          options={accounts}
          value={accountValue}
          setValue={setAccountValue}
          errorMessage={formValidationError.accountOne}
          />
        <Input
          title={isVoucher ? "Importo conto1 (€)" : "Importo (€)"}
          type="tel"
          value={amountOne}
          onChange={(e) => setAmountOne(e.target.value)}
          errorMessage={formValidationError.amountOne}
          />
        {isVoucher && (
          <>
            <Select
              title={"Conto2"}
              options={accountTwo}
              value={accountTwoValue}
              setValue={setaccountTwoValue}
              />
            <Input
              title={"Importo conto2 (€)"}
              type="tel"
              value={amountTwo}
              onChange={(e) => setAmountTwo(e.target.value)}
              />
          </>
        )}
        <Input
          title={"Descrizione"}
          type="textarea"
          placeholder={"Inserisci una descrizione"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
