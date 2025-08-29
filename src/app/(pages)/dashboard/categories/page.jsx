"use client";
import { ButtonIcon } from "@/app/components/ui/button";
import Tabs from "@/app/components/ui/tabs";
import { Plus, RefreshCcw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";

export default function CategoriesPage() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const tabs = [
    {
      value: "entrate",
      tab: <IncomeContainer items={[]} />,
    },
    {
      value: "uscite",
      tab: <ExpensesContainer items={[]} />,
    },
  ];
  const [value, setValue] = useState(tabs[0]);

  const handleNewCategorie = (e) => {
    try {
      //TODO:
      setModal({
        show: true,
        type: "error",
        data:{title: "ciaoo", description:"aaaaaaaaaaaaaaa"},
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // evento che gestisce il recupero dei dati quando la pagina viene inizializzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // aggiungere funzioni recupero dati 
      console.log("AGGIORNA");
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      <div className="w-full flex items-center justify-between flex-wrap gap-3">
        <Tabs tabs={tabs} value={value} setValue={setValue} />
        <div className="flex gap-3 w-full md:w-fit">
          <ButtonIcon icon={<RefreshCcw />} />
          <Button onClick={handleNewCategorie}>
            <Plus />
            <p>Nuova categoria</p>
          </Button>
        </div>
      </div>
      {value.tab}
    </div>
  );
}

function IncomeContainer({ items }) {
  return (
    <div className="max-h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-scroll scrollbar-hide gap-3">
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
      <FakeCard type={"entrate"} />
    </div>
  );
}

function ExpensesContainer({ items }) {
  return (
    <div className="max-h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-auto scrollbar-hide gap-3">
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
      <FakeCard type={"uscite"} />
    </div>
  );
}

function FakeCard({ type }) {
  return (
    <div className="bg-card border border-border-card rounded-lg text-muted-foreground h-30 flex items-center justify-center">
      FakeCard - {type}
    </div>
  );
}
