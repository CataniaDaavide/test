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
import { hexToRgba } from "@/lib/utils";

// tipi di conti disponibile
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

  const fetchAccounts = async () => {
    try {
      setLoader(true);

      const api = new ApiClient();
      const response = await api.get("/api/accounts/get");
      console.log(response);
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

  return (
    <>
      <Actions setShowFilter={setShowFilter} fetchAccounts={fetchAccounts} />
      <Accounts accounts={accounts} fetchAccounts={fetchAccounts} />
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
function Accounts({ accounts, fetchAccounts }) {
  return (
    <>
      <ScrollArea className="flex-1 min-h-0 w-full p-5 pt-0" noscrollbar>
        <FadeUp className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {accounts.map((a, index) => {
            return (
              <AccountCard key={index} data={a} fetchAccounts={fetchAccounts} />
            );
          })}
        </FadeUp>
      </ScrollArea>
    </>
  );
}

function AccountCard({ data, fetchAccounts }) {
  const { setDialog } = useDialogCustom();
  const { setLoader } = useLoader();
  const { setMessage } = useMessage();

  // funzione per eliminare in modo logico il conto
  const handleDelete = async () => {
    try {
      setLoader(true);

      const api = new ApiClient();
      const response = await api.post("/api/accounts/delete", {
        id: data.id,
      });

      setMessage({
        title: "Conto eliminato",
        description: "Conto eliminato con successo.",
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
    <Card className="w-full flex-row! h-fit! items-center justify-between p-6 gap-3!">
      <div className="flex w-full items-center gap-3">
        <div
          className="min-w-14 h-14 flex items-center justify-center border-2 rounded-full"
          style={{
            backgroundColor: hexToRgba(data.hexColor, 0.4),
            borderColor: data.hexColor,
          }}
        >
          {data.emoji}
        </div>
        <div className="flex flex-col gap-1">
          <p className="break-all text-sm">{data.name}</p>
          <p className="break-all text-sm text-muted-foreground">
            {accountTypes.find((type) => type.value === data.type)?.label ??
              "Altro"}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setDialog({
              show: true,
              type: "account",
              data: {
                // id: data.id,
                // name: data.name,
                // type: data.type,
                // emoji: data.emoji,
                // hexColor: data.hexColor,
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
          onClick={() =>
            setMessage({
              title: "Eliminazione conto",
              status: "warning",
              content: (
                <div className="flex flex-col text-muted-foreground text-sm">
                  <p className="mb-3">
                    Sei sicuro di voler eliminare il conto Buoni pasto?
                    <span className="font-semibold text-primary ml-1 mr-1">
                      {data.emoji} - {data.name} (€
                      {data.amount.replace(".", ",")})
                    </span>
                    ?
                  </p>
                  <p className="mb-3">
                    Cliccando su
                    <span className="font-semibold text-primary ml-1">
                      Elimina
                    </span>
                    , il conto verrà rimosso dall’elenco e non sarà più
                    utilizzabile.
                  </p>
                  <p>
                    Le transazioni associate a questo conto resteranno invariate
                    e continueranno a mostrarla come conto di riferimento.
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
                  onClick={handleDelete}
                >
                  Elimina
                </Button>,
              ],
            })
          }
        >
          <Trash />
        </Button>
      </div>
    </Card>
  );
}
