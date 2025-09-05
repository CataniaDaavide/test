"use client";
import { Calendar, Clock, TriangleAlert } from "lucide-react";
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
import { useContext, useEffect, useRef, useState } from "react";
import { convertDate, fetchApi, formValidation } from "@/app/core/baseFunctions";
import Select from "../select";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { AccountsTypeOptions } from "@/app/(pages)/dashboard/accounts/page";
import { ModalContext } from "@/app/context/ModalContext";

export default function ModalTransiction({ data, handleCloseModal }) {
  const { base_exceptionManager } = useExceptionManager();
  const { setModal } = useContext(ModalContext);
  const {
    _id,
    date: initialDate,
    createAt,
    categorieId,
    accountOneId,
    amountOne: initialAmountOne,
    accountTwoId,
    amountTwo: initialAmountTwo,
    description: initialDescription,
    accounts: initialAccounts,
    handleDelete
  } = data;
  const title = _id ? "Modifica movimento" : "Creazione movimento";
  const modalDescription = "Registra una nuova entrata o uscita";
  const isFirstRender = useRef(true);
  const [formValidationError, setFormValidationError] = useState({
    date: "",
    time: "",
    categorieValue: "",
    accountOneValue: "",
    amountOneValue: "",
    accountTwoValue: "",
    amountTwoValue: "",
  });
  const [isVoucher, setIsVoucher] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [date, setDate] = useState(
    initialDate ? convertDate(initialDate, "yyyy-MM-dd") : convertDate(undefined, "yyyy-MM-dd")
  );
  const [time, setTime] = useState(initialDate ? convertDate(initialDate, "HH:mm") : convertDate(undefined, "HH:mm"));
  const [description, setDescription] = useState(initialDescription || "");

  const [categoriesOptions, setCategoriesOptions] = useState();
  const [categorieValue, setCategorieValue] = useState();

  const [accountsOptions, setAccountsOptions] = useState();
  const [accountOneValue, setAccountOneValue] = useState();
  const [amountOneValue, setAmountOneValue] = useState(initialAmountOne || 0);

  const [accountsTwoOptions, setAccountsTwoOptions] = useState();
  const [accountTwoValue, setAccountTwoValue] = useState();
  const [amountTwoValue, setAmountTwoValue] = useState(initialAmountTwo || "");

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
      setCategoriesOptions(arr);
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
      setAccountsOptions(arr);
    });
  };

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
        date: {
          value: date,
          validators: {
            notEmpty: { message: "Inserisci una data" },
          },
        },
        time: {
          value: time,
          validators: {
            notEmpty: { message: "Inserisci un orario" },
          },
        },
        categorieValue: {
          value: categorieValue,
          validators: {
            notEmpty: { message: "Seleziona una categoria" },
          },
        },
        accountOneValue: {
          value: accountOneValue,
          validators: {
            notEmpty: { message: "Seleziona un conto" },
          },
        },
        amountOneValue: {
          value: amountOneValue,
          validators: {
            notEmpty: { message: "Inserisci l'importo" },
          },
        },
        accountTwoValue: {
          value: accountTwoValue,
          validators: {
            callback: {
              message: "Se inserisci un importo per il secondo conto, devi selezionarlo",
              callback: (value) => {
                const ris = !(accountTwoValue === undefined && amountTwoValue.length > 0);
                return {
                  valid: ris,
                  message: "",
                };
              },
            },
          },
        },
        amountTwoValue: {
          value: amountTwoValue,
          validators: {
            callback: {
              message: "Se hai selezionato un secondo conto, devi inserire l'importo",
              callback: (value) => {
                const ris = !(amountTwoValue.length === 0 && accountTwoValue != undefined);
                return {
                  valid: ris,
                  message: "",
                };
              },
            },
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
  }, [
    date,
    time,
    categorieValue,
    accountOneValue,
    amountOneValue,
    accountsTwoOptions,
    accountTwoValue,
    amountTwoValue,
  ]);

  // recupero dati
  useEffect(() => {
    loadCategories();
    loadAccounts();
  }, []);

  // init value categorie e account
  useEffect(() => {
    if (categoriesOptions) {
      setCategorieValue(categoriesOptions.find((x) => x._id.toString() === categorieId));
    }
    if (accountsOptions) {
      setAccountOneValue(accountsOptions.find((x) => x._id.toString() === accountOneId));
    }
  }, [categoriesOptions, accountsOptions]);

  // evento che viene elaborato ad ogni cambiamento di "accountOneValue" (valore della select "Conto1")
  useEffect(() => {
    try {
      if (accountOneValue && accountOneValue != {}) {
        const { type } = accountOneValue;
        if (type && type.toString().trim().toUpperCase() === "V") {
          setIsVoucher(true);
          setAccountsTwoOptions(accountsOptions.filter((x) => x?.type.toString().trim().toUpperCase() != "V"));
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
      setIsLoading(true);

      const hasError = formValidationInit();
      if (hasError) return exit();

      const requestData = {
        date: new Date(`${date}T${time}`).toISOString(),
        createAt: createAt ?? new Date().toISOString(),
        categorieId: categorieValue._id.toString(),
        accountOneId: accountOneValue._id.toString(),
        amountOne: amountOneValue,
      };
      if (_id) {
        requestData._id = _id;
      }
      if (isVoucher) {
        if (accountTwoValue && accountTwoValue != {}) {
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

      //TODO: CHIMATA DA FARE
      console.log(requestData);

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
          options={categoriesOptions}
          value={categorieValue}
          setValue={setCategorieValue}
          errorMessage={formValidationError.categorieValue}
        />
        <Select
          title={isVoucher ? "Conto1" : "Conto"}
          required={true}
          options={accountsOptions}
          value={accountOneValue}
          setValue={setAccountOneValue}
          errorMessage={formValidationError.accountOneValue}
        />
        <Input
          title={isVoucher ? "Importo conto1 (€)" : "Importo (€)"}
          required={true}
          type="tel"
          value={amountOneValue}
          onChange={(e) => setAmountOneValue(e.target.value)}
          errorMessage={formValidationError.amountOneValue}
        />
        {isVoucher && (
          <>
            <Select
              title={"Conto2"}
              options={accountsTwoOptions}
              value={accountTwoValue}
              setValue={setAccountTwoValue}
              errorMessage={formValidationError.accountTwoValue}
            />
            <Input
              title={"Importo conto2 (€)"}
              type="tel"
              value={amountTwoValue}
              onChange={(e) => setAmountTwoValue(e.target.value)}
              errorMessage={formValidationError.amountTwoValue}
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
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
      </CardContent>

      <CardFooter className={"mt-3"}>
        {_id ? (
          <>
            <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
              <span>Modifica</span>
            </Button>
            <Button onClick={handleDelete} color={"danger"}>
              <span>Elimina</span>
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
            <span>Crea</span>
          </Button>
        )}
      </CardFooter>
    </>
  );
}
