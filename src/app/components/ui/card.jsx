import { Plus, Wallet } from "lucide-react";
import { Button, ButtonIcon } from "./button";

// Card principale
export function Card({ children, className = "" }) {
  return (
    <div
      className={`
        w-full flex flex-col gap-3 justify-center p-5 
        rounded-xl border shadow-md 
        bg-card border-border-card
        ${className}
        `}
    >
      {children}
    </div>
  );
}

// Header della card
export function CardHeader({ children, className = "" }) {
  return (
    <div className={`w-full flex items-start justify-between ${className}`}>
      {children}
    </div>
  );
}

// Contenitore per titolo + descrizione
export function CardHeaderContent({ children, className = "" }) {
  return <div className={`h-full flex flex-col gap-1 justify-center ${className}`}>{children}</div>;
}

// Azioni nella header
export function CardHeaderActions({ children, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>{children}</div>
  );
}

// Titolo
export function CardTitle({ children, className = ""}) {
  return (
    <p className={`text-lg font-semibold flex gap-2 items-center ${className}`}>
      {children}
    </p>
  );
}

// Descrizione
export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

// Contenuto principale
export function CardContent({ children, className = "" }) {
  return <div className={`w-full h-full flex flex-col gap-3 ${className}`}>{children}</div>;
}

// Footer della card
export function CardFooter({ children, className = "" }) {
  return (
    <div className={`w-full flex gap-3 justify-end ${className}`}>
      {children}
    </div>
  );
}

// --- Esempio di utilizzo ---
export function ExampleCard({}) {
  return (
    <Card>
      <CardHeader>
        <CardHeaderContent>
          <CardTitle>
            <Wallet />
            Titolo
          </CardTitle>
          <CardDescription>Descrizione breve</CardDescription>
        </CardHeaderContent>

        <CardHeaderActions>
          <ButtonIcon icon={<Plus />} color="trasparent" />
          <ButtonIcon icon={<Plus />} color="trasparent" />
        </CardHeaderActions>
      </CardHeader>

      <CardContent>
        <div className="w-full flex flex-col gap-3">
          <div className="w-full h-10 bg-blue-200" />
          <div className="w-full h-10 bg-blue-200" />
          <div className="w-full h-10 bg-blue-200" />
          <div className="w-full h-10 bg-blue-200" />
          <div className="w-full h-10 bg-blue-200" />
        </div>
      </CardContent>
      <CardFooter>
        <Button color="">Annulla</Button>
        <Button color="danger">Elimina</Button>
        <Button color="success">Conferma</Button>
      </CardFooter>
    </Card>
  );
}
