"use client";
import ColorPicker from "@/components/color-picker";
import EmojiPicker from "@/components/emoji-picker";
import { FadeUp } from "@/components/fade-up";
import { SelectCustom } from "@/components/select-custom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDialogCustom } from "@/context/DialogCustomContext";
import { useLoader } from "@/context/LoaderContext";
import { useMessage } from "@/context/MessageContext";
import { ApiClient } from "@/lib/api-client";
import { cn, hexToRgba, validateField } from "@/lib/utils";
import { ListFilter, Pen, Plus, RefreshCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [showFilter, setShowFilter] = useState(false);
  const { setLoader } = useLoader();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      setLoader(true);

      const api = new ApiClient();
      const response = await api.get("/api/categories/getCategories");

      setCategories(response.data.categories);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const tabs = [
    { label: "Entrate", value: "income" },
    { label: "Uscite", value: "expense" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Actions
        setShowFilter={setShowFilter}
        fetchCategories={fetchCategories}
      />
      <Categories
        activeTab={activeTab}
        categories={categories}
        fetchCategories={fetchCategories}
      />
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
function Actions({ setShowFilter, fetchCategories }) {
  const { setDialog } = useDialogCustom();

  return (
    <div className={"w-full flex md:justify-end gap-3 px-5 mb-3"}>
      <Button variant="secondary" size="icon" onClick={fetchCategories}>
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
            data: {
              fetchCategories: fetchCategories,
            },
          })
        }
      >
        <Plus /> Crea categoria
      </Button>
    </div>
  );
}

// lista di categorie in base al tipo richiesto dal tab
function Categories({ activeTab, categories, fetchCategories }) {
  return (
    <>
      <ScrollArea className="flex-1 min-h-0 w-full p-5 pt-0" noscrollbar>
        <FadeUp className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories
            .filter((c) => c.type == activeTab)
            .map((c, index) => {
              return (
                <CategoryCard
                  key={index}
                  data={c}
                  fetchCategories={fetchCategories}
                />
              );
            })}
        </FadeUp>
      </ScrollArea>
    </>
  );
}

function CategoryCard({ data, fetchCategories }) {
  const { setDialog } = useDialogCustom();
  console.log(data);
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
          onClick={() =>
            setDialog({
              show: true,
              type: "category",
              data: {
                id: data.id,
                name: data.name,
                type: data.type,
                emoji: data.emoji,
                hexColor: data.hexColor,
                fetchCategories: fetchCategories,
              },
            })
          }
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

// modale per creare e modificare categorie di movimenti
export function DialogCreateOrEditCategory() {
  const { dialog, setDialog } = useDialogCustom();
  const { setLoader } = useLoader();
  const { setMessage } = useMessage();

  const {
    id,
    name: categoryName,
    emoji: categoryEmoji,
    type: categoryType,
    hexColor: categoryHexColor,
    fetchCategories,
  } = dialog.data;

  const defaultFormValues = {
    id: id ?? "",
    name: categoryName ?? "",
    type: "",
    emoji: categoryEmoji ?? "",
    hexColor: categoryHexColor ?? "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const defaultFormErrors = Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [key, ""]),
  );
  const [formErrors, setFormErrors] = useState(defaultFormErrors);

  // FORM VALIDATOR
  const formValidator = {
    name: [
      {
        validate: (value) => value.trim() !== "",
        message: "Nome obbligatorio",
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
        validate: (t) => t?.value.trim() !== "",
        message: "Tipo obbligatorio",
      },
    ],
  };

  // tipi di categoria disponibile
  const categoryTypes = [
    { label: "Entrata", value: "income" },
    { label: "Uscite", value: "expense" },
  ];
  const [type, setType] = useState(
    categoryTypes.find((c) => c.value === categoryType),
  );

  // HANDLER GENERICO
  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    const error = formValidator[field]
      ? validateField(field, value, formValidator)
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

      const newFormValues = { ...formValues, type: type };
      for (const field in newFormValues) {
        const errorFound = formValidator[field]
          ? validateField(field, newFormValues[field], formValidator)
          : "";
        newErrors[field] = errorFound;

        if (!hasError && errorFound) hasError = true;
      }

      setFormErrors(newErrors);

      if (hasError) return;

      const api = new ApiClient();
      const response = await api.post("/api/categories/edit", newFormValues);

      setMessage({
        title: id ? "Categoria modificata" : "Categoria creata",
        description: id
          ? "Categoria modificata con successo"
          : "Categoria creata con successo",
        status: "success",
      });
    } catch (e) {
      setMessage({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    } finally {
      fetchCategories();
      setLoader(false);
      setDialog({
        show: false,
        type: "",
        data: {},
      });
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
          <DialogTitle>
            {id ? "Modifica categoria" : "Creazione categoria"}
          </DialogTitle>
          <DialogDescription>
            {id
              ? "Modifica i dettagli della categoria selezionata"
              : "Inserisci i dettagli per creare una nuova categoria"}
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
              <SelectCustom
                label={"Tipo"}
                required
                value={type}
                options={categoryTypes}
                setValue={setType}
                classNameTrigger={
                  "border-1! bg-transparent! hover:bg-transparent!"
                }
              />
              <EmojiPicker
                label={"Emoji"}
                required
                value={formValues.emoji}
                onChange={(value) => handleChange("emoji", value)}
              />
              <ColorPicker
                label={"Colore"}
                required
                value={formValues.hexColor}
                onChange={(value) => handleChange("hexColor", value)}
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
                onClick={() => {}}
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
