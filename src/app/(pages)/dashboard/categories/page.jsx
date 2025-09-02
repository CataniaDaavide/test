"use client";
import { ButtonIcon } from "@/app/components/ui/button";
import Tabs from "@/app/components/ui/tabs";
import { Edit, Plus, RefreshCcw, Trash, TriangleAlert } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { fetchApi } from "@/app/core/baseFunctions";
import { Card } from "@/app/components/ui/card";
import Emoji from "@/app/components/emoji";
import { LoaderIcon } from "@/app/components/ui/loader-full-page";

export default function CategoriesPage() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const [isLoader, setIsLoader] = useState(false);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [tab, setTab] = useState("U");
  const tabsOptions = [
    {
      label: "Uscite",
      value: "U",
    },
    {
      label: "Entrate",
      value: "E",
    },
  ];

  const handleNewCategorie = (e) => {
    try {
      setModal({
        show: true,
        type: "categorie",
        data: {},
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const loadCategories = async () => {
    setIsLoader(true);
    await fetchApi("/api/categories/categoriesGet", "POST", {}, async (res) => {
      const data = await res.json();

      if (!res.ok && data.error != "") {
        // setError(data.error);
        return;
      }

      const { categories } = data;
      setCategories({
        income: categories.filter((c) => c.type === "E"),
        expense: categories.filter((c) => c.type === "U"),
      });
    });
    setIsLoader(false);
  };

  // evento che gestisce il recupero dei dati quando la pagina viene renderizzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // funzione per recupero le categorie
      loadCategories();
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 px-3">
      <div className="w-full flex items-center justify-between flex-wrap gap-3">
        <Tabs tabs={tabsOptions} value={tab} setValue={setTab} />
        <div className="flex gap-3 w-full md:w-fit">
          <ButtonIcon
            onClick={loadCategories}
            icon={<RefreshCcw className="hover:animate-spin" />}
          />
          <Button onClick={handleNewCategorie}>
            <Plus />
            <p>Nuova categoria</p>
          </Button>
        </div>
      </div>
      {isLoader ? (
        <LoaderIcon className={"mt-3"} />
      ) : (
        <>
          {tab === "U" && (
            <CardContainer
              tabsOptions={tabsOptions}
              items={categories.expense}
            />
          )}
          {tab === "E" && (
            <CardContainer
              tabsOptions={tabsOptions}
              items={categories.income}
            />
          )}
        </>
      )}
    </div>
  );
}

function CardContainer({ tabsOptions, items }) {
  return (
    <div className="max-h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-scroll scrollbar-hide gap-3">
      {items.map((item, index) => {
        return (
          <CategorieCard key={index} data={item} tabsOptions={tabsOptions} />
        );
      })}
    </div>
  );
}

function CategorieCard({ data, tabsOptions }) {
  const { base_exceptionManager } = useExceptionManager();
  const { setModal } = useContext(ModalContext);
  const { _id, emoji, hexColor, status, type, name, userId } = data;
  // click sul pulsante modifica
  const handleEdit = (e) => {
    try {
      e.preventDefault();

      setModal({
        show: true,
        type: "categorie",
        data: { ...data, handleDelete: handleDelete },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const handleCloseModal = () => {
    try {
      setModal({
        show:false,
        type:"",
        data: undefined
      })
    } catch (error) {
      base_exceptionManager(error)
    }
  }

  //click sul pulsante conferma eliminazione
  const handleConfirmDelete = async (e) => {
    try {
      e.preventDefault();
      const requestData = {
        _id: _id,
      };
      await fetchApi(
        "/api/categories/categorieDelete",
        "POST",
        requestData,
        async (res) => {
          const data = await res.json();

          if (!res.ok && data.error != "") {
            base_exceptionManager({message: data.error})
          }else{
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
          title: "Eliminazione categoria",
          icon: <TriangleAlert size={40} className="text-amber-600" />,
          message: (
            <p className="text-muted-foreground">
              Sei sicuro di voler eliminare la categoria {emoji} - {name}?
              <br />
              <br />
              Cliccando su
              <strong className="text-background-inverse ml-1">Elimina</strong>, la
              categoria verrà rimossa dall’elenco e non sarà più modificabile.
              <br />
              <br />
              Le transazioni già assegnate a questa categoria resteranno
              invariate e continueranno a mostrarla normalmente.
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
            {tabsOptions.find((t) => type === t.value).label}
          </p>
        </div>
      </div>
      <div className="flex gap-1">
        <ButtonIcon icon={<Edit />} onClick={handleEdit} color={"trasparent"} />
        <ButtonIcon icon={<Trash />} onClick={handleDelete} color={"danger"} />
      </div>
    </Card>
  );
}
