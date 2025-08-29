"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderActions,
  CardHeaderContent,
  CardTitle,
} from "@/app/components/ui/card";
import PercentageBar from "@/app/components/ui/percentage-bar";
import { CardSliderTest } from "@/app/components/ui/slider";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ArrowRight, Calendar, ChartPie } from "lucide-react";
import { useRouter } from "next/navigation";

//hoocks - functions - lib

//icons

//components

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      <div className="w-full flex md:hidden">
        <CardSliderTest />
      </div>
      <div className="w-full hidden md:flex">
        <StatsContainer />
      </div>
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-3">
        <RecentMovementsContainer />
        <OtherStastsContainer />
      </div>
    </div>
  );
}

function StatsContainer() {
  return (
    <div className="w-full gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      <FakeCard type="STATS" />
      <FakeCard type="STATS" />
      <FakeCard type="STATS" />
      <FakeCard type="STATS" />
    </div>
  );
}

function RecentMovementsContainer() {
  const { base_exceptionManager } = useExceptionManager();
  const router = useRouter();

  // click sul pulsante vedi tutti i moviemnti
  const handleClick = (e) => {
    try {
      router.push("/dashboard/movements");
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <div className="grid col-span-2">
      <Card className="w-full">
        <CardHeader>
          <CardHeaderContent>
            <CardTitle>Movimenti recenti</CardTitle>
            <CardDescription>Ultimi 10 movimenti</CardDescription>
          </CardHeaderContent>
          <CardHeaderActions>
            <Button onClick={handleClick} color={"trasparent"}>
              <ArrowRight />
              <span>Vedi tutti</span>
            </Button>
          </CardHeaderActions>
        </CardHeader>

        <CardContent>
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
          <FakeCard type="RECENT MOVEMENT" />
        </CardContent>
      </Card>
    </div>
  );
}

function OtherStastsContainer() {
  return (
    <div className="flex flex-col gap-3">
      <ExpensesByCategory />
      <MonthlyIncomeExpenseComparison />
    </div>
  );
}

function ExpensesByCategory() {
  let expensesList = ["","","","","","","","","",];

  return (
    <Card>
      <CardHeader>
        <CardHeaderContent>
          <CardTitle>
            <ChartPie />
            Spese per categoria
          </CardTitle>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="min-h-20 flex flex-col gap-3 items-center justify-center">
        {expensesList.length != 0 ? (
          <>
            {expensesList.map((item, index) => (
              <ItemListExpensesByCategory key={index} />
            ))}
          </>
        ) : (
          <p className="text-muted-foreground">Nessun movimento trovato</p>
        )}
      </CardContent>
    </Card>
  );
}

function ItemListExpensesByCategory() {
  return <PercentageBar title={"test"} percentage={30}/>;
}

function MonthlyIncomeExpenseComparison() {
  return (
    <Card>
      <CardHeader>
        <CardHeaderContent>
          <CardTitle>
            <Calendar />
            Confronto mensile
          </CardTitle>
        </CardHeaderContent>
      </CardHeader>
      <CardContent>
        <p>da fare</p>
      </CardContent>
    </Card>
  );
}

function FakeCard({ type = "" }) {
  return (
    <div className="w-full h-30 bg-card border border-border-card rounded-lg text-muted-foreground flex items-center justify-center">
      FakeCard - {type}
    </div>
  );
}
