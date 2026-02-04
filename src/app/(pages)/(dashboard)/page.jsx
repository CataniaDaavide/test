"use client";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/UserContext";
import { ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  return (
    <ScrollArea className="flex flex-1 min-h-0 w-full px-5" noscrollbar>
      <FadeUp className={"flex flex-1 w-full flex-col gap-10"}>
        {/*Benvenuto */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Bentornato, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ecco cosa è successo alle tue finanze oggi, 3 Febbraio.
          </p>
        </div>

        <Statistics />
        <div className="h-full w-full grid grid-cols-1 xl:grid-cols-4 xl:gap-3">
          <div className="col-span-3">
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

function Statistics() {
  return (
    <div className="flex flex-1 w-full flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Statistiche</p>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
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
