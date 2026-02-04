"use client";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDialogCustom } from "@/context/DialogCustomContext";
import { mockupCategories } from "@/data/temp-data";
import { cn, hexToRgba } from "@/lib/utils";
import { ListFilter, Pen, Plus, RefreshCcw, Trash } from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
  const { setDialog } = useDialogCustom();
  const [showFilter, setShowFilter] = useState(false);

  const tabs = [
    { label: "Entrate", value: "income" },
    { label: "Uscite", value: "expense" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* actions */}
      <Actions setShowFilter={setShowFilter} setDialog={setDialog} />
      <Categories activeTab={activeTab} />
    </>
  );
}

function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="bg-card border rounded-lg p-1 w-fit mx-5 mb-3">
      {tabs.map((t, index) => {
        return (
          <button
            key={index}
            className={cn(
              "text-sm px-3 py-1 rounded cursor-pointer",
              activeTab == t.value
                ? "bg-secondary text-primary!"
                : "text-muted-foreground",
            )}
            onClick={() => setActiveTab(t.value)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// riga di pulsanti azioni per la pagina deelle categorie
function Actions({ setShowFilter, setDialog }) {
  return (
    <div className={"w-full flex md:justify-end gap-3 px-5 mb-3"}>
      <Button variant="secondary" size="icon">
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
            type: "category",
            data: {},
          })
        }
      >
        <Plus /> Crea categoria
      </Button>
    </div>
  );
}

// lista di categorie in base al tipo richiesto dal tab
function Categories({ activeTab }) {
  return (
    <>
      <ScrollArea className="flex-1 min-h-0 w-full p-5 pt-0" noscrollbar>
        <FadeUp className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockupCategories
            .filter((c) => c.type == activeTab)
            .map((c, index) => {
              return <CategoryCard key={index} data={c} />;
            })}
        </FadeUp>
      </ScrollArea>
    </>
  );
}

function CategoryCard({ data }) {
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
            {data.type == "income" ? "Entrata" : "Uscita"}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className={"hover:bg-transparent!"}
          onClick={() => {}}
        >
          <Pen />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={"hover:bg-transparent!"}
          onClick={() => {}}
        >
          <Trash />
        </Button>
      </div>
    </Card>
  );
}
