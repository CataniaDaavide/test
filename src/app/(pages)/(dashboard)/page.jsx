"use client";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/UserContext";
import { ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <ScrollArea className="flex flex-1 w-full p-5 pt-0" noscrollbar>
      <FadeUp className={"flex flex-1 w-full flex-col gap-10"}>
        {/*Benvenuto */}
        <WelcomeUser />

        <StatisticsCards />

        <div className="h-full w-full grid grid-cols-1 xl:grid-cols-3 xl:gap-3">
          <div className="col-span-2">
            <RecentMovements />
          </div>
          <div className="w-full flex flex-col gap-10 xl:gap-3 mt-10 xl:mt-0">
            <MonthlyExpenseByCategory />
            <CashFlowComparison />
          </div>
        </div>
      </FadeUp>
    </ScrollArea>
  );
}

function WelcomeUser() {
  const { user } = useUser();

  // frasi motivazionali da mostrare in modo randomico
  const motivationalPhrases = [
    "Le tue finanze iniziano da qui. Tieni traccia di ogni movimento.",
    "Un piccolo controllo oggi, grandi risultati domani.",
    "Dai un’occhiata ai tuoi movimenti e mantieni il controllo del tuo denaro.",
    "Aggiungi i tuoi movimenti e resta sempre al passo con le tue finanze.",
    "Ogni movimento conta: costruisci il tuo futuro finanziario.",
    "Più consapevolezza oggi, più libertà domani.",
    "Tieni sotto controllo le spese e guida tu il tuo denaro.",
    "Inizia ora: il tuo equilibrio finanziario parte da qui.",
  ];

  // recupero della frase motivazionale
  const randomPhrase =
    motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight">
        Bentornato, {user?.name}
      </h1>
      <p className="text-sm text-muted-foreground">{randomPhrase}</p>
    </div>
  );
}

function StatisticsCards() {
  return (
    <div className="flex flex-1 w-full flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Statistiche</p>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <Card className={"w-full h-32"} />
        <Card className={"w-full h-32"} />
        <Card className={"w-full h-32"} />
        <Card className={"w-full h-32"} />
      </div>
    </div>
  );
}

function RecentMovements() {
  return (
    <Card className="w-full flex flex-col gap-2 p-0! xl:p-4! bg-transparent! border-0! xl:border! xl:bg-card!">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="font-semibold">Movimenti recenti</p>
          <p className="text-sm text-muted-foreground">Ultimi 10 movimenti</p>
        </div>
        <Link href={"/movements"}>
          <Button variant="ghost" size="icon">
            <ArrowRight />
          </Button>
        </Link>
      </div>
      <ScrollArea className={"h-72"} noscrollbar>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 10 }).map((_, index) => {
            return <Card key={index} className={"w-full h-16"} />;
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}

function MonthlyExpenseByCategory() {
  return <Card className={"w-full flex-1 min-h-32"} />;
}

function CashFlowComparison() {
  return <Card className={"w-full flex-1 min-h-32"} />;
}
