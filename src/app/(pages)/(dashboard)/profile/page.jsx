"use client";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Pencil, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const bannerUrl =
    "https://images.unsplash.com/photo-1666615435088-4865bf5ed3fd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const avatarUrl =
    "https://images.unsplash.com/photo-1666615435088-4865bf5ed3fd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <ScrollArea className="flex flex-1 min-h-0 w-full px-5" noscrollbar>
      <FadeUp className="flex flex-1 w-full flex-col gap-10">
        {/* Sezione Header: Banner, Avatar e Azioni */}
        <div className="relative w-full">
          {/* Banner */}
          <div className="w-full h-32 md:h-52 rounded-lg overflow-hidden bg-zinc-800">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-5 rounded-full w-24 h-24 md:w-32 md:h-32 border-4 border-background overflow-hidden flex items-center justify-center bg-zinc-900">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-2xl md:text-4xl font-bold text-emerald-500">
                JD
              </span>
            )}
          </div>
          {/* Pulsante Modifica */}
          <div className="absolute right-0 -bottom-12">
            <Button
              variant="outline"
              className="rounded-full gap-2 border-zinc-700"
            >
              <Pencil className="w-4 h-4" />
              Modifica Profilo
            </Button>
          </div>
        </div>

        {/* Info Utente */}
        <div className="mt-5 flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Mario Rossi</h1>
          <p className="text-muted-foreground -mt-2">@mario_finanze</p>

          <p className="max-w-xl text-sm md:text-base text-foreground/90">
            Risparmiatore seriale e investitore consapevole. Il mio obiettivo è
            l'indipendenza finanziaria entro il 2030. 📈
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Iscritto {formatDate(new Date("2026-01-01").toISOString(), "MMMM yyyy")}
            </div>
          </div>

          {/* Finance Stats (al posto dei follower) */}
          <div className="flex gap-8 mt-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase">
                Saldo Totale
              </span>
              <span className="text-lg font-bold text-emerald-500">
                € 14.250,00
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase">
                Risparmio Mensile
              </span>
              <span className="text-lg font-bold">€ 650,00</span>
            </div>
          </div>
        </div>
      </FadeUp>
    </ScrollArea>
  );
}
