"use client";

import { useState } from "react";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Pencil, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatDate, validateField } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessage } from "@/context/MessageContext";
import { useLoader } from "@/context/LoaderContext";
import { useDialogCustom } from "@/context/DialogCustomContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiClient } from "@/lib/api-client";
import { ImagePreview } from "@/components/image-preview";

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
  const { setDialog } = useDialogCustom();

  return (
    <div className="relative w-full">
      {/* Banner */}
      <HeaderBanner bannerUrl={user?.bannerUrl} />

      {/* Avatar */}
      <HeaderAvatar user={user} className={"absolute -bottom-12 left-5"} />

      {/* Pulsante Modifica */}
      <div className="absolute right-0 -bottom-12">
        <Button
          className="rounded-full gap-2 bg-card hover:bg-card text-primary border"
          onClick={() =>
            setDialog({
              show: true,
              type: "profile",
              data: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                bio: user.bio,
                bannerUrl: user.bannerUrl,
                avatarUrl: user.avatarUrl,
              },
            })
          }
        >
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
        className,
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

// modale per modificare il profilo
export function DialogEditProfile() {
  const { dialog, setDialog } = useDialogCustom();
  const { setLoader } = useLoader();
  const { setMessage } = useMessage();
  const { setUser } = useUser();

  const {
    id,
    name: profileName,
    surname: profileSurname,
    bio: profileBio,
    bannerUrl: profileBannerUrl,
    avatarUrl: profileAvatarUrl,
  } = dialog.data;

  const defaultFormValues = {
    id: id,
    name: profileName,
    surname: profileSurname,
    bio: profileBio ?? "",
    bannerUrl: profileBannerUrl ?? "",
    avatarUrl: profileAvatarUrl ?? "",
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
    surname: [
      {
        validate: (value) => value.trim() !== "",
        message: "Cognome obbligatorio",
      },
    ],
    avatarUrl: [
      {
        validate: (value) => {
          if (!value) return true; // campo vuoto è ok
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        message: "Avatar URL non valido o non è un'immagine",
      },
    ],
    bannerUrl: [
      {
        validate: (value) => {
          if (!value) return true; // campo vuoto è ok
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        message: "Banner URL non valido o non è un'immagine",
      },
    ],
  };

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

  // reucpera i dati dell'utente aggiornati
  const fetchUser = async () => {
    try {
      const api = new ApiClient();
      const response = await api.get("/api/auth/me");

      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);

      let hasError = false;
      const newErrors = {};

      for (const field in formValues) {
        const errorFound = formValidator[field]
          ? validateField(field, formValues[field], formValidator)
          : "";
        newErrors[field] = errorFound;

        if (!hasError && errorFound) hasError = true;
      }

      setFormErrors(newErrors);

      if (hasError) return;

      const api = new ApiClient();
      const response = await api.post("/api/profile/edit", formValues);

      setMessage({
        title: "Profilo modificato",
        description: "Profilo modificato con successo.",
        status: "success",
      });
      fetchUser();
      setDialog({
        show: false,
        type: "",
        data: {},
      });
    } catch (e) {
      setMessage({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    } finally {
      setLoader(false);
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
          <DialogTitle>Modifica profilo</DialogTitle>
          <DialogDescription>
            Modifica i dettagli del tuo account per personalizzare la tua
            esperienza.
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
              <div className="grid col-span-1">
                <Input
                  id="surname"
                  label={"Cognome"}
                  placeholder="Inserisci cognome"
                  required
                  type="text"
                  value={formValues.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  error={formErrors.surname}
                  variant="outline"
                />
              </div>
              <div className="grid col-span-1">
                <Input
                  id="bio"
                  label={"Bio"}
                  placeholder="Inserisci bio"
                  type="textarea"
                  value={formValues.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  error={formErrors.bio}
                  variant="outline"
                />
              </div>
              <div className="grid col-span-1">
                <Input
                  id="bannerUrl"
                  label={"Link banner"}
                  placeholder="Inserisci link banner"
                  type="textarea"
                  value={formValues.bannerUrl}
                  onChange={(e) => handleChange("bannerUrl", e.target.value)}
                  error={formErrors.bannerUrl}
                  variant="outline"
                />
              </div>
              <ImagePreview
                src={formValues.bannerUrl}
                onErrorChange={(hasError) =>
                  setFormErrors((prev) => ({
                    ...prev,
                    bannerUrl: hasError ? "Banner URL non valido" : "",
                  }))
                }
              />
              <div className="grid col-span-1">
                <Input
                  id="avatarUrl"
                  label={"Link avatar"}
                  placeholder="Inserisci link avatar"
                  type="textarea"
                  value={formValues.avatarUrl}
                  onChange={(e) => handleChange("avatarUrl", e.target.value)}
                  error={formErrors.avatarUrl}
                  variant="outline"
                />
              </div>
              <ImagePreview
                src={formValues.avatarUrl}
                onErrorChange={(hasError) =>
                  setFormErrors((prev) => ({
                    ...prev,
                    avatarUrl: hasError ? "Avatar URL non valido" : "",
                  }))
                }
              />
            </div>
          </ScrollArea>
        </div>

        {/* Footer fisso */}
        <DialogFooter className={"w-full"}>
          <Button
            variant="outline"
            size="lg"
            className={"bg-secondary! border-0!"}
            onClick={handleSubmit}
          >
            Modifica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
