"use client";
import { ButtonIcon } from "@/app/components/ui/button";
import Tabs from "@/app/components/ui/tabs";
import { Edit, Plus, RefreshCcw, Trash } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { fetchApi } from "@/app/core/baseFunctions";
import { Card } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import Emoji from "@/app/components/emoji";
import { LoaderIcon } from "@/app/components/ui/loader-full-page";

export default function CategoriesPage() {
  const router = useRouter();
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const [isLoader, setIsLoader] = useState(false);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [tabValue, setTabValue] = useState("U");
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
      //TODO:
      setModal({
        show: true,
        type: "categorie",
        data: { title: "ciaoo", description: "aaaaaaaaaaaaaaa" },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const fn = async () => {
    setIsLoader(true);
    await fetchApi("/api/categories/getCategories", "POST", {}, async (res) => {
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

  // evento che gestisce il recupero dei dati quando la pagina viene inizializzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // aggiungere funzioni recupero dati
      fn();
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 px-3">
      <div className="w-full flex items-center justify-between flex-wrap gap-3">
        <Tabs tabs={tabsOptions} value={tabValue} setValue={setTabValue} />
        <div className="flex gap-3 w-full md:w-fit">
          <ButtonIcon
            onClick={fn}
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
          {tabValue === "U" && (
            <CardContainer
              tabsOptions={tabsOptions}
              items={categories.expense}
            />
          )}
          {tabValue === "E" && (
            <CardContainer
              tabsOptions={tabsOptions}
              items={categories.income}
            />
          )}
        </>
      )}
      <p>{isLoader ? "true" : "false"}</p>
    </div>
  );
}

function CardContainer({ tabsOptions, items }) {
  const { modal, setModal } = useContext(ModalContext);

  // click sul pulsante edit
  const handleEdit = () => {
    try {
      setModal({
        show: true,
        type: "error",
        data: {},
      });
    } catch (error) {
      // base_exceptionManager(error)
    }
  };
  // click sul pulsante delete
  const handleDelete = () => {
    try {
    } catch (error) {
      // base_exceptionManager(error)
    }
  };

  return (
    <div className="max-h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-scroll scrollbar-hide gap-3">
      {items.map((item, index) => {
        const { name, emoji, hexColor, type } = item;

        return (
          <Card
            key={index}
            className="!flex-row !items-center !justify-between"
          >
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
              <ButtonIcon
                icon={<Edit />}
                fn={handleEdit}
                color={"trasparent"}
              />
              <ButtonIcon icon={<Trash />} fn={handleDelete} color={"danger"} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
