"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { useDialogCustom } from "@/context/DialogCustomContext";
import { Input } from "@/components/ui/input";
import { SelectCustom } from "@/components/select-custom";
import { Calendar, Clock, ListFilter, Plus, RefreshCcw } from "lucide-react";
import { applyMaskField, cn, formatDate, validateField } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoader } from "@/context/LoaderContext";
import { mockupAccounts, mockupCategories } from "@/data/temp-data";

export default function MovementPage() {
  const { setDialog } = useDialogCustom();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <div className={"w-full flex justify-end gap-3 px-6"}>
        <Button variant="secondary" size="icon">
          <RefreshCcw />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setShowFilter(!showFilter)}
        >
          <ListFilter />
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            setDialog({
              show: true,
              type: "movement",
              data: {},
            })
          }
        >
          <Plus /> Movimento
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0 w-full p-6" noscrollbar>
        <FadeUp className="flex flex-col gap-3">
          <Button
            onClick={() =>
              setDialog({
                show: true,
                type: "movement",
                data: {
                  id: "684aa945bbfb7d771580dc71",
                  userId: "682e280409285bb856379161",
                  date: "2025-06-12T10:16:00.000Z",
                  description:
                    "Vestiti fazione uomo e donna per Martini Andrea lellod 367737053355442176",
                  categoryId: "683c3a5aaed32a11ec7e005f",
                  type: "U",
                  accounts: [
                    {
                      accountId: "683c3ad0aed32a11ec7e0068",
                      amount: 20,
                    },
                  ],
                },
              })
            }
          >
            EDIT MOVEMENT
          </Button>
        </FadeUp>
      </ScrollArea>
    </>
  );
}

// modale per creare e modificare movimenti (entrate, uscite, trasferimenti di denaro)
export function DialogCreateOrEditMovement() {
  const { dialog, setDialog } = useDialogCustom();
  const { setLoader } = useLoader();

  const {
    id,
    userId,
    date: movementDate,
    description: movementDescription,
    categoryId,
    type,
    accounts: movementAccounts,
  } = dialog.data;

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountsFiltered, setAccountsFiltered] = useState([]);

  const [category, setCategory] = useState(null);
  const [accountOne, setAccountOne] = useState(null);
  const [accountTwo, setAccountTwo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);

        // Simula delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Carica le categorie disponibili
        const categoriesOptions = mockupCategories.map((category) => {
          const option = {
            label: `${category.emoji} ${category.name} - ${category.type === "E" ? "Entrata" : "Uscita"}`,
            value: category.id,
            type: category.type,
          };

          // Se esiste un categoryId selezionato, impostalo come default
          if (categoryId && category.id === categoryId) {
            setCategory(option);
          }

          return option;
        });

        // Carica gli account disponibili
        const accountsOptions = mockupAccounts.map((account) => {
          const option = {
            label: `${account.emoji} ${account.name}`,
            value: account.id,
            type: account.type,
          };

          // Se esiste un account selezionato, impostalo come default
          if (accountOne && account.id === accountOne) {
            setAccountOne(option);
          }

          return option;
        });

        setCategories(categoriesOptions);
        setAccounts(accountsOptions);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);

  const defaultFormValues = {
    date: formatDate(movementDate, "yyyy-MM-dd"),
    time: formatDate(movementDate, "HH:mm"),
    category: "",
    amountOne: "",
    isVoucher: false,
    amountTwo: "",
    description: movementDescription ?? "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const defaultFormErrors = Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [key, ""]),
  );
  const [formErrors, setFormErrors] = useState(defaultFormErrors);

  // INPUT MASK
  const formMask = {
    amountOne: [
      { mask: (value) => value.replace(".", ",") },
      { mask: (value) => value.replace(/[^0-9,]/g, "") },
      {
        mask: (value) => {
          if (value.startsWith(",")) value = "0" + value; // aggiunge 0 se inizia con ,
          const parts = value.split(",");
          if (parts.length > 2) return parts[0];
          const integerPart = parts[0].slice(0, 10);
          const decimalPart = parts[1]?.slice(0, 2);
          return decimalPart !== undefined
            ? `${integerPart},${decimalPart}`
            : integerPart;
        },
      },
    ],
    amountTwo: [
      { mask: (value) => value.replace(".", ",") },
      { mask: (value) => value.replace(/[^0-9,]/g, "") },
      {
        mask: (value) => {
          if (value.startsWith(",")) value = "0" + value;
          const parts = value.split(",");
          if (parts.length > 2) return parts[0];
          const integerPart = parts[0].slice(0, 10);
          const decimalPart = parts[1]?.slice(0, 2);
          return decimalPart !== undefined
            ? `${integerPart},${decimalPart}`
            : integerPart;
        },
      },
    ],
  };

  // FORM VALIDATOR
  const formValidator = {
    amountOne: [
      {
        validate: (value) => value.trim() !== "",
        message: "Importo obbligatorio",
      },
      {
        validate: (value) => /^\d{1,10}(,\d{1,2})?$/.test(value),
        message: "Formato non valido",
      },
    ],
    amountTwo: [
      {
        validate: (value) => value.trim() !== "",
        message: "Importo obbligatorio",
      },
      {
        validate: (value) => /^\d{1,10}(,\d{1,2})?$/.test(value),
        message: "Formato non valido",
      },
    ],
    category: [
      {
        validate: (value) => value.trim() !== "",
        message: "Categoria obbligatoria",
      },
    ],
  };

  // HANDLER GENERICO
  const handleChange = (field, value) => {
    const maskedValue = formMask[field]
      ? applyMaskField(field, value, formMask)
      : value;

    setFormValues((prev) => ({
      ...prev,
      [field]: maskedValue,
    }));

    const error = formValidator[field]
      ? validateField(field, maskedValue, formValidator)
      : "";

    setFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  return (
    <Dialog
      open={dialog.show}
      onOpenChange={(open) => {
        if (!open)
          setDialog({
            show: false,
            type: "",
            data: {},
          });
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col overflow-hidden",
          "min-w-full sm:min-w-lg sm:max-w-lg",
          "h-full sm:max-h-[80vh]",
          "border-0 sm:border! rounded-none! sm:rounded-md!",
          "bg-card",
        )}
      >
        {/* Header fisso */}
        <DialogHeader className="text-start">
          <DialogTitle>
            {id ? "Modifica movimento" : "Creazione movimento"}
          </DialogTitle>
          <DialogDescription>
            {id
              ? "Modifica i dettagli del movimento selezionato"
              : "Inserisci i dettagli per registrare un nuovo movimento"}
          </DialogDescription>
        </DialogHeader>

        {/* Contenuto scrollabile */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full overflow-y-auto" noscrollbar>
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="date"
                label={"Data"}
                required
                type="date"
                iconLeft={<Calendar />}
                value={formValues.date}
                onChange={(e) => handleChange("date", e.target.value)}
                variant="outline"
              />
              <Input
                id="time"
                label={"Orario"}
                required
                type="time"
                iconLeft={<Clock />}
                value={formValues.time}
                onChange={(e) => handleChange("time", e.target.value)}
                variant="outline"
              />
              <div className="grid col-span-2">
                <SelectCustom
                  label={"Categoria"}
                  required
                  value={category}
                  options={categories}
                  setValue={setCategory}
                  classNameTrigger={
                    "border-1! bg-transparent! hover:bg-transparent!"
                  }
                />
              </div>
              <div className="grid col-span-2">
                <SelectCustom
                  label={"Conto"}
                  required
                  value={accountOne}
                  setValue={setAccountOne}
                  options={accounts}
                  classNameTrigger={
                    "border-1! bg-transparent! hover:bg-transparent!"
                  }
                />
              </div>
              <div className="grid col-span-2">
                <Input
                  label={"Importo"}
                  required
                  type="text"
                  inputMode="decimal"
                  value={formValues.amountOne}
                  onChange={(e) => handleChange("amountOne", e.target.value)}
                  placeholder="0,00"
                  variant="outline"
                />
              </div>
              {formValues.isVoucher && (
                <>
                  <div className="grid col-span-2">
                    <SelectCustom
                      label={"Conto2"}
                      search
                      value={accountTwo}
                      setValue={setAccountTwo}
                      options={Array.from({ length: 5 }, (_, i) => ({
                        value: "value" + i,
                        label: "label" + i,
                      }))}
                    />
                  </div>
                  <div className="grid col-span-2">
                    <Input
                      label={"Importo2"}
                      type="text"
                      inputMode="decimal"
                      value={formValues.amountTwo}
                      onChange={(e) =>
                        handleChange("amountTwo", e.target.value)
                      }
                      placeholder="0,00"
                      variant="secondary"
                      className="border-0!"
                    />
                  </div>
                </>
              )}
              <div className="grid col-span-2">
                <Input
                  label={"Descrizione"}
                  type="textarea"
                  placeholder="Inserisci descrizione"
                  value={formValues.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outline"
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer fisso */}
        <DialogFooter className={cn(id ? "grid grid-cols-2 gap-3" : "w-full")}>
          {id ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className={"bg-secondary! border-0!"}
                onClick={() =>
                  setDialog({
                    show: false,
                    type: "",
                    data: "",
                  })
                }
              >
                Modifica
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className={"bg-red-500!"}
                onClick={() => {
                  console.log(formValues);
                }}
              >
                Elimina
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              onClick={() =>
                setDialog({
                  show: false,
                  type: "",
                  data: "",
                })
              }
            >
              Crea
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
