import { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Input, InputLabel } from "./ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { motion } from "motion/react";

// Palette primaria
const primaryColors = [
  { label: "Corallo", value: "#FF6B6B" },
  { label: "Rosa acceso", value: "#F06595" },
  { label: "Viola", value: "#845EF7" },
  { label: "Blu indaco", value: "#5C7CFA" },
  { label: "Azzurro", value: "#339AF0" },
  { label: "Turchese", value: "#22B8CF" },
  { label: "Menta", value: "#20C997" },
  { label: "Verde", value: "#51CF66" },
  { label: "Verde lime", value: "#94D82D" },
  { label: "Giallo", value: "#FCC419" },
  { label: "Arancio", value: "#FFA94D" },
  { label: "Rosa chiaro", value: "#FF8787" },
  { label: "Lavanda", value: "#B197FC" },
  { label: "Lime soft", value: "#A9E34B" },
  { label: "Azzurro soft", value: "#66D9E8" },
];

// Palette secondaria
const secondaryColors = [
  { label: "Rosso", value: "#EF4444" },
  { label: "Arancione scuro", value: "#F97316" },
  { label: "Verde scuro", value: "#22C55E" },
  { label: "Blu", value: "#3B82F6" },
  { label: "Viola scuro", value: "#8B5CF6" },
  { label: "Rosa", value: "#EC4899" },
  { label: "Grigio", value: "#6B7280" },
  { label: "Nero", value: "#111827" },
  { label: "Bianco", value: "#FFFFFF" },
];

const colors = [...primaryColors, ...secondaryColors];

export default function ColorPicker({
  id,
  label,
  required,
  onChange = () => {},
}) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [customColor, setCustomColor] = useState("#000000");
  const [showSearch, setShowSearch] = useState(false);

  const handleSelect = (hex) => {
    setSelected(hex);
    setCustomColor(hex); // sincronizza custom picker
    onChange(hex);
  };

  const filteredColors = useMemo(() => {
    if (!search) return colors;
    const s = search.toLowerCase();
    return colors.filter(
      (c) =>
        c.label.toLowerCase().includes(s) || c.value.toLowerCase().includes(s),
    );
  }, [search]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center">
        {label && <InputLabel id={id} label={label} required={required} />}
        <Search
          className="text-muted-foreground cursor-pointer"
          size={18}
          onClick={() => setShowSearch((prev) => !prev)}
        />
      </div>

      <motion.div
        className={cn("w-full overflow-hidden", showSearch ? "py-2" : "pb-1")}
        initial={{ y: 10, opacity: 0, height: 0 }}
        animate={
          showSearch
            ? { y: 0, opacity: 1, height: "auto" }
            : { y: 10, opacity: 0, height: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Cerca colore o hex..."
            iconLeft={<Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            action={
              search?.length !== 0 && (
                <button
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  onClick={() => setSearch("")}
                >
                  <X />
                </button>
              )
            }
          />
        </div>
      </motion.div>

      {/* 🎨 Griglia */}
      <Card className="bg-transparent rounded-lg p-2! overflow-hidden">
        <CardContent
          className={cn(
            filteredColors.length !== 0
              ? "grid grid-cols-5 gap-2"
              : "flex items-center justify-center",
            "overflow-y-auto h-38 noscrollbar p-1!",
          )}
        >
          {/* Altri colori */}
          {filteredColors.length === 0 ? (
            <p className="col-span-5 text-center text-sm text-muted-foreground py-4">
              Nessun colore trovato
            </p>
          ) : (
            <>
              {/* Primo elemento = custom picker */}
              <CustomColorPicker
                color={customColor}
                onChange={handleSelect}
                selected={selected}
              />

              {filteredColors.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    "w-full h-14 border-2 rounded-lg p-1 cursor-pointer",
                    selected === item.value
                      ? "border-primary!"
                      : "border-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(item.value)}
                    title={`${item.label} (${item.value})`}
                    className={cn("rounded w-full h-full")}
                    style={{ backgroundColor: item.value }}
                  />
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Preview HEX selezionato */}
      {selected && (
        <p className="text-sm text-muted-foreground mt-1">
          Colore selezionato: <span className="font-mono">{selected}</span>
        </p>
      )}
    </div>
  );
}

function CustomColorPicker({ color, onChange, selected }) {
  return (
    <div
      className={`relative rounded-lg border-2 h-14 w-full p-1 cursor-pointer overflow-hidden flex items-center justify-center ${
        selected === color ? "border-primary!" : "border-border"
      }`}
    >
      {/* Overlay centrale */}
      <span className="absolute z-999 inset-0 flex items-center justify-center text-sm font-bold text-white pointer-events-none bg-black/25">
        RGB
      </span>

      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: color }} />

      {/* Input color invisibile */}
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full p-0 m-0 border-none cursor-pointer opacity-0"
      />
    </div>
  );
}
