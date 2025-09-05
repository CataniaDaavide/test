"use client";
import Emoji from "@/app/components/emoji";
import { Button, ButtonIcon } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { LoaderIcon } from "@/app/components/ui/loader-full-page";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { convertDate, fetchApi } from "@/app/core/baseFunctions";
import { Edit, Plus, RefreshCcw, Trash, TriangleAlert } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function MovementsPage() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const [isLoader, setIsLoader] = useState(false);
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // recupero categorie
  const loadCategories = async () => {
    await fetchApi("/api/categories/categoriesGet", "POST", {}, async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        base_exceptionManager({ message: data.error });
        return;
      }
      setCategories(data.categories || []);
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
      setAccounts(data.accounts || []);
    });
  };

  // recupero movimenti
  const loadMovements = async () => {
    setIsLoader(true);
    await fetchApi("/api/movements/movementsGet", "POST", {}, async (res) => {
      const data = await res.json();

      if (!res.ok && data.error != "") {
        base_exceptionManager({ message: data.error });
        return;
      }

      const { movements } = data;
      setMovements(movements);
    });
    setIsLoader(false);
  };

  // click sul pulsante nuovo movimento
  const handleNewMovement = (e) => {
    try {
      //TODO:
      setModal({
        show: true,
        type: "movement",
        data: {},
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // evento che gestisce il recupero dei dati quando la pagina viene renderizzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // funzione per recupero le categorie
      loadMovements();
      loadCategories();
      loadAccounts();
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 px-3">
      <div className="w-full flex items-center justify-end flex-wrap gap-3">
        <div className="flex gap-3 w-full md:w-fit">
          <ButtonIcon onClick={loadMovements} icon={<RefreshCcw className="hover:animate-spin" />} />
          <Button onClick={handleNewMovement}>
            <Plus />
            <p>Nuova conto</p>
          </Button>
        </div>
      </div>
      {isLoader ? (
        <LoaderIcon className={"mt-3"} />
      ) : (
        <MovementsContainer movements={movements} categories={categories} />
      )}
    </div>
  );
}

function MovementsContainer({ movements, categories }) {
  return (
    <>
      <p className="text-lg md:text-2xl font-bold">Elenco movimenti (number):</p>
      <div className="max-h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-scroll scrollbar-hide gap-3 pb-3">
        {movements.map((movement, index) => {
          return <MovementsCard key={index} data={movement} categories={categories} />;
        })}
      </div>
    </>
  );
}

function MovementsCard({ data, categories = [] }) {
  const { base_exceptionManager } = useExceptionManager();
  const { setModal } = useContext(ModalContext);
  const { type, description, date, categorieId, accounts } = data;
  const amount = accounts.reduce((acc, x) => acc + x.amount, 0);
  const [categorie, setCategorie] = useState(null);
  const convertedDate = convertDate(date, "dd/MM/yyyy HH:mm");
  const colorAmount = type === "E" ? "text-green-600" : "text-red-600";
  const sign = type === "E" ? "+" : "-";

  //click sul pulsante conferma eliminazione
  const handleConfirmDelete = async (e) => {
    try {
      e.preventDefault();
      const requestData = {
        _id: _id,
      };
      await fetchApi("/api/movements/movementDelete", "POST", requestData, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          base_exceptionManager({ message: data.error });
          return;
        } else {
          handleCloseModal();
        }
      });
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
          title: "Eliminazione moviemento",
          icon: <TriangleAlert size={40} className="text-amber-600" />,
          message: (
            <p className="text-muted-foreground">
              Sei sicuro di voler eliminare definitivamente questo movimento?
              <br />
              <br />
              Cliccando su
              <strong className="text-background-inverse ml-1">Elimina</strong>, il movimento verrà rimosso in modo
              permanente e non sarà più recuperabile.
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

// click sul pulsante modifica
  const handleEdit = (e) => {
    try {
      e.preventDefault();

      setModal({
        show: true,
        type: "movement",
        data: { ...data, handleDelete: handleDelete },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  useEffect(() => {
    const found = categories.find((c) => c._id === categorieId);
    setCategorie(found || null);
  }, [categories, categorieId]);

  if (!categorie) return null;

  return (
    <Card className="!flex-row !items-center !justify-between">
      <div className="w-full flex items-center gap-3">
        <Emoji emoji={categorie?.emoji} hexColor={categorie?.hexColor} />
        <div className="max-w-[120px] md:max-w-[300px]">
          <p className="text-nowrap">{categorie?.name}</p>
          <p className="text-sm text-gray-500">{convertedDate}</p>
          <p className="text-sm text-gray-500 truncate">{description}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className={`text-lg font-bold md:pr-3 text-nowrap ${colorAmount}`}>
          {sign} €{amount.toFixed(2)}
        </p>
        <div className="flex gap-1">
          <ButtonIcon icon={<Edit />} onClick={handleEdit} color={"trasparent"} />
          <ButtonIcon icon={<Trash />} onClick={handleDelete} color={"danger"} />
        </div>
      </div>
    </Card>
  );
}
