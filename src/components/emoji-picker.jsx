import { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Input, InputLabel } from "./ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

const emojis = [
  { label: "Casa", value: "🏠" },
  { label: "Affitto", value: "🏡" },
  { label: "Spesa", value: "🛒" },
  { label: "Cibo", value: "🍽️" },
  { label: "Ristorante", value: "🍕" },
  { label: "Caffè", value: "☕" },
  { label: "Trasporti", value: "🚗" },
  { label: "Autobus", value: "🚌" },
  { label: "Carburante", value: "⛽" },
  { label: "Viaggio", value: "✈️" },
  { label: "Hotel", value: "🏨" },
  { label: "Shopping", value: "🛍️" },
  { label: "Vestiti", value: "👕" },
  { label: "Salute", value: "💊" },
  { label: "Medico", value: "🏥" },
  { label: "Palestra", value: "🏋️" },
  { label: "Sport", value: "⚽" },
  { label: "Intrattenimento", value: "🎬" },
  { label: "Musica", value: "🎵" },
  { label: "Libri", value: "📚" },
  { label: "Studio", value: "🎓" },
  { label: "Lavoro", value: "💼" },
  { label: "Stipendio", value: "💰" },
  { label: "Risparmi", value: "🏦" },
  { label: "Investimenti", value: "📈" },
  { label: "Regali", value: "🎁" },
  { label: "Famiglia", value: "👨‍👩‍👧‍👦" },
  { label: "Bambini", value: "🧸" },
  { label: "Animali", value: "🐶" },
  { label: "Tecnologia", value: "💻" },
  { label: "Telefono", value: "📱" },
  { label: "Internet", value: "🌐" },
  { label: "Bollette", value: "💡" },
  { label: "Acqua", value: "🚿" },
  { label: "Elettricità", value: "⚡" },
  { label: "Tempo libero", value: "🎮" },
  { label: "Feste", value: "🎉" },
  { label: "Bellezza", value: "💄" },
  { label: "Viaggi brevi", value: "🧳" },
  { label: "Donazioni", value: "❤️" },
  { label: "Tasse", value: "🧾" },
];

export default function EmojiPicker({
  id,
  label,
  required,
  onChange = () => {},
}) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const handleSelect = (emoji) => {
    setSelected(emoji);
    onChange(emoji);
  };

  const filteredEmojis = useMemo(() => {
    if (!search) return emojis;

    return emojis.filter((e) =>
      e.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <InputLabel id={id} label={label} required={required} />}

      {/* 🔍 Search */}
      <Input
        type="text"
        placeholder="Cerca categoria..."
        iconLeft={<Search />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        action={
          search?.length != 0 ? (
            <button
              className="cursor-pointer absolute right-3 text-muted-foreground hover:text-primary"
              onClick={() => setSearch("")}
            >
              <X />
            </button>
          ) : (
            <></>
          )
        }
      />

      <Card className="bg-transparent rounded-lg p-2! overflow-hidden">
        <CardContent
          className={cn(
            filteredEmojis.length != 0
              ? "grid grid-cols-5 gap-2"
              : "flex items-center justify-center",
            "overflow-y-auto h-38 noscrollbar p-1!",
          )}
        >
          {filteredEmojis.length === 0 && (
            <p className="col-span-5 text-center text-sm text-muted-foreground py-4">
              Nessuna emoji trovata
            </p>
          )}

          {filteredEmojis.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect(item.value)}
              title={item.label}
              className={cn(
                "text-2xl p-2 rounded-lg transition hover:bg-muted border-2 h-fit!",
                selected === item.value && "border-primary!",
              )}
            >
              {item.value}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
