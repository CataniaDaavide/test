"use client";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Pencil, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatDate } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <ScrollArea className="flex flex-1 min-h-0 w-full p-5 pt-0" noscrollbar>
      <FadeUp className="flex flex-1 w-full flex-col gap-10">
        {/* Sezione Header: Banner, Avatar e Azioni */}
        <Header user={user} />

        {/* Info Utente */}
        <UserInfo user={user} />
      </FadeUp>
    </ScrollArea>
  );
}

function Header({ user }) {
  return (
    <div className="relative w-full">
      {/* Banner */}
      <HeaderBanner bannerUrl={user?.bannerUrl} />

      {/* Avatar */}
      <HeaderAvatar user={user} className={"absolute -bottom-12 left-5"} />

      {/* Pulsante Modifica */}
      <div className="absolute right-0 -bottom-12">
        <Button className="rounded-full gap-2 bg-card hover:bg-card text-primary border">
          <Pencil className="w-4 h-4" />
          Modifica Profilo
        </Button>
      </div>
    </div>
  );
}

function HeaderBanner({ bannerUrl = "" }) {
  return (
    <div className="w-full h-32 md:h-52 rounded-lg overflow-hidden bg-secondary">
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
  );
}

function HeaderAvatar({ user, className }) {
  const initials = user
    ? `${user.name?.[0] || ""}${user.surname?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <Avatar
      className={cn(
        "w-24 h-24 md:w-32 md:h-32 border-4 border-background overflow-hidden",
        className
      )}
    >
      <AvatarImage
        src={user?.avatarUrl}
        alt="Avatar"
        className="w-full h-full object-cover"
      />

      <AvatarFallback className="font-bold text-2xl md:text-4xl">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}



function UserInfo({ user }) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      {/* nome e cognome */}
      <h1 className="text-2xl font-bold">
        {user?.name} {user?.surname}
      </h1>

      {/* username */}
      <p className="text-muted-foreground -mt-2">@{user?.username}</p>

      {/* bio */}
      <p className="max-w-xl text-sm md:text-base text-foreground/90">
        {user?.bio}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b border-zinc-800 pb-4">
        {/* data iscrizione dell'account */}
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <p>Iscritto</p>
          <p>{formatDate(new Date("2026-01-01").toISOString(), "MMMM yyyy")}</p>
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
  );
}
