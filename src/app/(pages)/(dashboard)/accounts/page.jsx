"use client";

import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDialogCustom } from "@/context/DialogCustomContext";
import { useLoader } from "@/context/LoaderContext";
import { useMessage } from "@/context/MessageContext";
import { ApiClient } from "@/lib/api-client";
import { ListFilter, Pen, Plus, RefreshCcw, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
  applyMaskField,
  cn,
  formatAmount,
  hexToRgba,
  parseAmount,
  validateField,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectCustom } from "@/components/select-custom";
import EmojiPicker from "@/components/emoji-picker";
import ColorPicker from "@/components/color-picker";

// Tipi di conti disponibili
const accountTypes = [
  { label: "Conto bancario", value: "bank" },
  { label: "Portafoglio", value: "wallet" }, // Wallet digitale (PayPal, Satispay)
  { label: "Buono", value: "voucher" }, // Gift card o buoni prepagati
  { label: "Libretto", value: "libretto" }, // Libretto bancario o postale
  { label: "Criptovaluta", value: "crypto" }, // Wallet crypto
  { label: "Contanti", value: "cash" }, // Cash fisico
  { label: "Altro", value: "other" }, // Tipo generico
];

export default function AccountsPage() {
  const [showFilter, setShowFilter] = useState(false);
  const { setLoader } = useLoader();
  const [accounts, setAccounts] = useState([]);
  const { setMessage } = useMessage();
  const { setDialog } = useDialogCustom();

  const fetchAccounts = async () => {
    try {
      setLoader(true);

      const api = new ApiClient();
      const response = await api.get("/api/accounts/get");

      setAccounts(response.data.accounts);
    } catch (e) {
      setMessage({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // funzione per eliminare in modo logico il conto
  const handleDelete = (data) => {
    setMessage({
      title: "Eliminazione conto",
      status: "warning",
      content: (
        <div className="flex flex-col text-muted-foreground text-sm">
          <p className="mb-3">
            Sei sicuro di voler eliminare il conto
            <span className="font-semibold text-primary ml-1 mr-1">
              {data.emoji} - {data.name} (€
              {formatAmount(data.amount)})
            </span>
            ?
          </p>
          <p className="mb-3">
            Cliccando su
            <span className="font-semibold text-primary ml-1">Elimina</span>, il
            conto verrà rimosso dall’elenco e non sarà più utilizzabile.
          </p>
          <p>
            Le transazioni associate a questo conto resteranno invariate e
            continueranno a mostrarla come conto di riferimento.
          </p>
        </div>
      ),
      actions: [
        <Button variant="secondary" size="lg">
          Annulla
        </Button>,
        <Button
          variant="secondary"
          size="lg"
          className={"bg-red-500! hover:bg-red-500!"}
          onClick={() => confirmHandleDelete(data.id)}
        >
          Elimina
        </Button>,
      ],
    });
  };
  const confirmHandleDelete = async (accountId) => {
    try {
      setLoader(true);

      const api = new ApiClient();
      const response = await api.post("/api/accounts/delete", {
        id: accountId,
      });

      setDialog({
        show: false,
        type: "",
        data: {},
      });
      fetchAccounts();
      setMessage({
        title: "Conto eliminato",
        description: "Conto eliminato con successo.",
        status: "success",
      });
    } catch (e) {
      setMessage({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Actions setShowFilter={setShowFilter} fetchAccounts={fetchAccounts} />
      <p className="font-semibold px-5 mb-1">
        Patrimonio totale:
        <span className="text-green-500 ml-1">
          {formatAmount(accounts.reduce((acc, value) => acc + value.amount, 0))}
        </span>
      </p>
      <Accounts
        accounts={accounts}
        handleDelete={handleDelete}
        fetchAccounts={fetchAccounts}
      />
    </>
  );
}

// riga di pulsanti azioni per la pagina dei conti
function Actions({ setShowFilter, fetchAccounts }) {
  const { setDialog } = useDialogCustom();

  return (
    <div className={"w-full flex md:justify-end gap-3 px-5 mb-3"}>
      <Button variant="secondary" size="icon" onClick={fetchAccounts}>
        <RefreshCcw />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <ListFilter />
      </Button>
      <Button
        variant="secondary"
        className="flex-1 md:max-w-52"
        onClick={() =>
          setDialog({
            show: true,
            type: "account",
            data: {
              fetchAccounts: fetchAccounts,
            },
          })
        }
      >
        <Plus /> Crea conto
      </Button>
    </div>
  );
}

// lista di conti
function Accounts({ accounts, handleDelete, fetchAccounts }) {
  return (
    <>
      <ScrollArea className="flex-1 min-h-0 w-full p-5 pt-0" noscrollbar>
        <FadeUp className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {accounts.map((a, index) => {
            return (
              <AccountCard
                key={index}
                data={a}
                handleDelete={handleDelete}
                fetchAccounts={fetchAccounts}
              />
            );
          })}
        </FadeUp>
      </ScrollArea>
    </>
  );
}

function AccountCard({ data, handleDelete, fetchAccounts }) {
  const { setDialog } = useDialogCustom();

  return (
    <Card className="w-full flex-row! h-fit! items-center justify-between p-6 gap-3!">
      {/* sx */}
      <div className="flex w-full items-center gap-3">
        {/* icon */}
        <div
          className="min-w-14 h-14 flex items-center justify-center border-2 rounded-full"
          style={{
            backgroundColor: hexToRgba(data.hexColor, 0.4),
            borderColor: data.hexColor,
          }}
        >
          {data.emoji}
        </div>
        {/* name + type */}
        <div className="flex flex-col gap-1">
          <p className="break-all text-sm">{data.name}</p>
          <p className="break-all text-sm text-muted-foreground">
            {accountTypes.find((type) => type.value === data.type)?.label ??
              "Altro"}
          </p>
        </div>
      </div>

      {/* dx */}
      <div className="flex flex-col gap-1 items-end">
        <p
          className="font-semibold text-lg text-nowrap"
          style={{ color: data.hexColor }}
        >
          {formatAmount(data.amount)}
        </p>
        {/* actions */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setDialog({
                show: true,
                type: "account",
                data: {
                  id: data.id,
                  name: data.name,
                  emoji: data.emoji,
                  amount: data.amount,
                  type: data.type,
                  hexColor: data.hexColor,
                  handleDelete: handleDelete,
                  fetchAccounts: fetchAccounts,
                },
              })
            }
          >
            <Pen />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={"hover:bg-red-500/10! hover:text-red-500"}
            onClick={() => handleDelete(data)}
          >
            <Trash />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// modale per creare e modificare conti
export function DialogCreateOrEditAccount() {
  const { dialog, setDialog } = useDialogCustom();
  const { setLoader } = useLoader();
  const { setMessage } = useMessage();

  const {
    id,
    name: accountName,
    emoji: accountEmoji,
    amount: accountAmount,
    type: accountType,
    hexColor: accountHexColor,
    handleDelete,
    fetchAccounts,
  } = dialog.data;

  const defaultFormValues = {
    id: id ?? "",
    name: accountName ?? "",
    amount: accountAmount ? formatAmount(accountAmount, false) : "0",
    type: accountTypes.find((a) => a.value === accountType),
    emoji: accountEmoji ?? "",
    hexColor: accountHexColor ?? "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const defaultFormErrors = Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [key, ""]),
  );
  const [formErrors, setFormErrors] = useState(defaultFormErrors);

  // INPUT MASK
  const formMask = {
    amount: [
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
  };

  // FORM VALIDATOR
  const formValidator = {
    name: [
      {
        validate: (value) => value.trim() !== "",
        message: "Nome obbligatorio",
      },
    ],
    amount: [
      {
        validate: (value) => value.trim() !== "",
        message: "Saldo obbligatorio",
      },
    ],
    emoji: [
      {
        validate: (value) => value.trim() !== "",
        message: "Emoji obbligatoria",
      },
    ],
    hexColor: [
      {
        validate: (value) => value.trim() !== "",
        message: "Colore obbligatoria",
      },
    ],
    type: [
      {
        validate: (t) => t && t.value.trim() !== "",
        message: "Tipo obbligatorio",
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);

      let hasError = false;
      const newErrors = {};

      for (const field in formValues) {
        const errorFound = formValidator[field]
          ? validateField(field, formValues[field], formValidator)
          : "";
        newErrors[field] = errorFound;

        if (!hasError && errorFound) hasError = true;
      }

      setFormErrors(newErrors);

      if (hasError) return;

      const api = new ApiClient();
      const response = await api.post("/api/accounts/edit", {
        ...formValues,
        type: formValues.type.value,
        amount: parseAmount(formValues.amount),
      });

      setMessage({
        title: id ? "Conto modificato" : "Conto creato",
        description: id
          ? "Conto modificato con successo."
          : "Conto creato con successo.",
        status: "success",
      });
      fetchAccounts();
      setDialog({
        show: false,
        type: "",
        data: {},
      });
    } catch (e) {
      setMessage({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    } finally {
      setLoader(false);
    }
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
          <DialogTitle>{id ? "Modifica conto" : "Creazione conto"}</DialogTitle>
          <DialogDescription>
            {id
              ? "Modifica il conto per organizzare le tue finanze in modo chiaro e semplice"
              : "Crea un nuovo conto per tenere sotto controllo le tue finanze"}
          </DialogDescription>
        </DialogHeader>

        {/* Contenuto scrollabile */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full overflow-y-auto" noscrollbar>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid col-span-1">
                <Input
                  id="name"
                  label={"Nome"}
                  placeholder="Inserisci nome"
                  required
                  type="text"
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  error={formErrors.name}
                  variant="outline"
                />
              </div>
              <div className="grid col-span-1">
                <Input
                  id="amount"
                  label={"Saldo iniziale"}
                  placeholder="0,00"
                  required
                  type="text"
                  inputMode="decimal"
                  value={formValues.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  onFocus={(e) => {
                    const value = parseInt(e.target.value.replace(",", "."));
                    if (value == 0) {
                      handleChange("amount", "");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.length != 0) return;
                    handleChange("amount", "0");
                  }}
                  error={formErrors.amount}
                  variant="outline"
                />
              </div>
              <SelectCustom
                label={"Tipo"}
                required
                value={formValues.type}
                options={accountTypes}
                setValue={(value) => handleChange("type", value)}
                classNameTrigger={
                  "border-1! bg-transparent! hover:bg-transparent!"
                }
                error={formErrors.type}
              />
              <EmojiPicker
                label={"Emoji"}
                required
                value={formValues.emoji}
                onChange={(value) => handleChange("emoji", value)}
                error={formErrors.emoji}
              />
              <ColorPicker
                label={"Colore"}
                required
                value={formValues.hexColor}
                onChange={(value) => handleChange("hexColor", value)}
                error={formErrors.hexColor}
              />
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
                onClick={handleSubmit}
              >
                Modifica
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className={"bg-red-500!"}
                onClick={() => handleDelete(dialog.data)}
              >
                Elimina
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              onClick={handleSubmit}
            >
              Crea
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
