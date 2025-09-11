"use client";
import Emoji from "@/app/components/emoji";
import { motion } from "framer-motion";
import { Button, ButtonIcon } from "@/app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import Input from "@/app/components/ui/input";
import { LoaderIcon } from "@/app/components/ui/loader-full-page";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { convertDate, fetchApi } from "@/app/core/baseFunctions";
import { Calendar, Edit, Funnel, Plus, RefreshCcw, Trash, TriangleAlert } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { EDGE_UNSUPPORTED_NODE_APIS } from "next/dist/shared/lib/constants";

export default function MovementsPage() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const [isLoader, setIsLoader] = useState(false);
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filter, setFilter] = useState({});

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
  const loadMovements = async (requestData = {}) => {
    setIsLoader(true);
    await fetchApi("/api/movements/movementsGet", "POST", requestData, async (res) => {
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
      loadMovements({});
      loadCategories();
      loadAccounts();
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3 md:p-5">
      <div className="w-full flex items-center justify-end flex-wrap gap-3">
        <div className="flex gap-3 w-full md:w-fit">
          <ButtonIcon
            onClick={() => {
              setFilterIsOpen(false);
              loadMovements({});
            }}
            icon={<RefreshCcw className="hover:animate-spin" />}
          />
          <ButtonIcon
            onClick={() => {
              setFilterIsOpen(!filterIsOpen);
            }}
            icon={<Funnel />}
          />
          <Button onClick={handleNewMovement}>
            <Plus />
            <p>Nuova movimento</p>
          </Button>
        </div>
      </div>
      <MovementFilter isOpen={filterIsOpen} loadMovements={loadMovements} />
      {isLoader ? (
        <LoaderIcon className={"mt-3"} />
      ) : (
        <MovementsContainer movements={movements} categories={categories} />
      )}
    </div>
  );
}

function MovementFilter({ isOpen = false, loadMovements }) {
  const { base_exceptionManager } = useExceptionManager();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [startDate, setStartDate] = useState(convertDate(threeMonthsAgo, "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(convertDate(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(false);

  const handleClearFilter = (e) => {
    try {
      e.preventDefault();
      setStartDate(convertDate(threeMonthsAgo, "yyyy-MM-dd"));
      setEndDate(convertDate(new Date(), "yyyy-MM-dd"));
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const handleSearch = (e) => {
    try {
      e.preventDefault();
      const filter = {
        startDate: startDate,
        endDate: endDate,
      };
      setIsLoading(true);
      loadMovements(filter);
      setIsLoading(false);
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const handleChangeDate = (e) => {
    try {
      const { name, value } = e.target;

      let start = startDate;
      let end = endDate;

      if (name === "start") {
        start = value;
        setStartDate(value);

        // Se la data di partenza è dopo la data di fine, sincronizziamo
        if (start > end) {
          setEndDate(value);
        }
      }

      if (name === "end") {
        end = value;
        setEndDate(value);

        // Se la data di fine è prima della data di partenza, sincronizziamo
        if (end < start) {
          setStartDate(value);
        }
      }
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "!max-h-[3000px]" : "!max-h-0 !overflow-hidden !p-0 !border-0"
      } w-full transition-all duration-500`}
    >
      <Card>
        <CardHeader>
          <CardTitle>Filtri</CardTitle>
        </CardHeader>
        <CardContent className="!flex-col md:!flex-row">
          <Input
            type="date"
            name="start"
            title={"Data inizio"}
            icon={<Calendar />}
            value={startDate}
            onChange={handleChangeDate}
            disabled={isLoading}
          />
          <Input
            type="date"
            name="end"
            title={"Data fine"}
            icon={<Calendar />}
            value={endDate}
            onChange={handleChangeDate}
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter className="!w-full md:!w-fit">
          <Button onClick={handleSearch} disabled={isLoading}>
            Cerca
          </Button>
          <Button onClick={handleClearFilter} disabled={isLoading}>
            Annulla
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function MovementsContainer({ movements, categories }) {
  return (
    <>
      <p className="text-lg md:text-2xl font-bold">Elenco movimenti ({movements.length}):</p>
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
    <Card className="!flex-row items-center w-full gap-3 p-3">
      <div className="flex-shrink-0">
        <Emoji emoji={categorie?.emoji} hexColor={categorie?.hexColor} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{categorie?.name}</p>
        <p className="text-sm text-gray-500">{convertedDate}</p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>

      <div className="flex-shrink-0 text-center">
        <p className={`text-lg font-bold text-nowrap ${colorAmount}`}>
          {sign} € {amount.toFixed(2).replace(".", ",")}
        </p>
        <div className="flex gap-1 justify-end">
          <ButtonIcon icon={<Edit />} onClick={handleEdit} color="transparent" />
          <ButtonIcon icon={<Trash />} onClick={handleDelete} color="danger" />
        </div>
      </div>
    </Card>
  );
}
