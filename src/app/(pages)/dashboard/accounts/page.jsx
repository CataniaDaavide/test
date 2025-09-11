"use client";
import { ButtonIcon } from "@/app/components/ui/button";
import {
  Edit,
  Plus,
  RefreshCcw,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { fetchApi } from "@/app/core/baseFunctions";
import { Card } from "@/app/components/ui/card";
import Emoji from "@/app/components/emoji";
import { LoaderIcon } from "@/app/components/ui/loader-full-page";

export const AccountsTypeOptions = [
  { label: "🏦 Conto bancario", value: "B" }, // B - bank
  { label: "💸 Contanti", value: "C" }, // C - cash
  { label: "🎫 Buoni", value: "V" }, // V - voucher
  { label: "💼 Altro", value: "O" }, // O - other
];

export default function AccountsPage() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const [isLoader, setIsLoader] = useState(false);
  const [accounts, setAccounts] = useState([]);

  // click sul pulsante nuovo conto
  const handleNewAccount = (e) => {
    try {
      //TODO:
      setModal({
        show: true,
        type: "account",
        data: {},
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // recupero conti
  const loadAccounts = async () => {
    setIsLoader(true);
    await fetchApi("/api/accounts/accountsGet", "POST", {}, async (res) => {
      const data = await res.json();

      if (!res.ok && data.error != "") {
        base_exceptionManager({ message: data.error });
        return;
      }

      const { accounts } = data;
      setAccounts(accounts);
    });
    setIsLoader(false);
  };

  // evento che gestisce il recupero dei dati quando la pagina viene renderizzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // funzione per recupero le categorie
      loadAccounts();
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3 md:p-5">
      <div className="w-full flex items-center justify-end flex-wrap gap-3">
        <div className="flex gap-3 w-full md:w-fit">
          <ButtonIcon
            onClick={loadAccounts}
            icon={<RefreshCcw className="hover:animate-spin" />}
          />
          <Button onClick={handleNewAccount}>
            <Plus />
            <p>Nuova conto</p>
          </Button>
        </div>
      </div>
      {isLoader ? (
        <LoaderIcon className={"mt-3"} />
      ) : (
        <AccountsContainer accounts={accounts} />
      )}
    </div>
  );
}

function AccountsContainer({ accounts }) {
  let totalAmount = accounts.reduce((acc, x) => acc + x.amount, 0);
  return (
    <>
      <div className="w-full flex gap-3 items-center">
        <p className="text-lg md:text-2xl font-bold">Patrimonio totale:</p>
        <p
          className={`text-xl font-bold ${
            Number(totalAmount) > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          €{totalAmount.toFixed(2).replace(".", ",")}
        </p>
      </div>
      <div className="max-h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-scroll scrollbar-hide gap-3 pb-3">
        {accounts.map((item, index) => {
          return <AccountCard key={index} data={item} />;
        })}
      </div>
    </>
  );
}

function AccountCard({ data }) {
  const { base_exceptionManager } = useExceptionManager();
  const { setModal } = useContext(ModalContext);
  const { _id, emoji, hexColor, status, type, name, userId, amount } = data;

  // click sul pulsante modifica
  const handleEdit = (e) => {
    try {
      e.preventDefault();

      setModal({
        show: true,
        type: "account",
        data: { ...data, handleDelete: handleDelete },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // click sul pulsante elimina
  const handleCloseModal = () => {
    try {
      setModal({
        show: false,
        type: "",
        data: undefined,
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // click sul pulsante conferma eliminazione
  const handleConfirmDelete = async (e) => {
    try {
      e.preventDefault();
      const requestData = {
        _id: _id,
      };
      await fetchApi(
        "/api/accounts/accountDelete",
        "POST",
        requestData,
        async (res) => {
          const data = await res.json();

          if (!res.ok && data.error != "") {
            base_exceptionManager({ message: data.error });
          } else {
            handleCloseModal();
          }
        }
      );
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // click sul pulsante elimina
  const handleDelete = (e) => {
    try {
      e.preventDefault();
      setModal({
        show: true,
        type: "alert",
        data: {
          title: "Eliminazione conto",
          icon: <TriangleAlert size={40} className="text-amber-600" />,
          message: (
            <p className="text-muted-foreground">
              Sei sicuro di voler eliminare il conto <strong className="text-background-inverse">{name} - €{amount.toFixed(2).replace(".",",")}</strong>?
              <br />
              <br />
              Cliccando su
              <strong className="text-background-inverse ml-1">Elimina</strong>,
              il conto verrà rimosso dall’elenco e non sarà più utilizzabile.
              <br />
              <br />
              Le transazioni associate a questo conto resteranno invariate e
              continueranno a mostrarla come conto di riferimento.
            </p>
          ),
          buttons: [
            "cancel",
            <Button onClick={handleConfirmDelete} color={"danger"}>
              Elimina
            </Button>,
          ],
        },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <Card className="!flex-row !items-center !justify-between">
      <div className="w-full flex items-center gap-3">
        <Emoji emoji={emoji} hexColor={hexColor} />
        <div>
          <p className="text-nowrap">{name}</p>
          <p className="text-sm text-gray-500">
            {AccountsTypeOptions.find((t) => type === t.value).label.slice(2)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold md:pr-3" style={{ color: hexColor }}>
          € {amount.toFixed(2)}
        </p>
        <div className="flex gap-1">
          <ButtonIcon
            icon={<Edit />}
            onClick={handleEdit}
            color={"transparent"}
          />
          <ButtonIcon
            icon={<Trash />}
            onClick={handleDelete}
            color={"danger"}
          />
        </div>
      </div>
    </Card>
  );
}
