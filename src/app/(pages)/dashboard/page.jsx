"use client";

import { Button, ButtonIcon } from "@/app/components/ui/button";
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
import Slider, { CardSliderTest } from "@/app/components/ui/slider";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import {
  ArrowRight,
  Calendar,
  ChartPie,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

//hoocks - functions - lib

//icons

//components

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      <StatsContainer />
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 pb-3">
        <RecentMovementsContainer />
        <OtherStastsContainer />
      </div>
    </div>
  );
}

function StatsContainer() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(containerRef.current.offsetWidth);
  }, [containerRef]);
  const stats = [
    {
      title: "Entrate del mese",
      amount: 0.0,
      icon: <TrendingUp size={16} />,
      percentage: 0,
    },
    {
      title: "Uscite del mese",
      amount: 0.0,
      icon: <TrendingDown size={16} />,
      percentage: 0,
    },
    {
      title: "Saldo Totale",
      amount: 0.0,
      icon: <Wallet size={16} />,
      // percentage: 0,
    },
    {
      title: "Obiettivi ???",
      amount: 0,
      icon: <Target size={16} />,
      // percentage: 0,
    },
  ];
  return (
    <>
      <div className="w-full flex md:hidden">
        <Slider cards={stats} containerRef={containerRef}>
          {stats.map((stat, index) => (
            <ItemListStatsContainer key={index} stat={stat} cardWidth={width} />
          ))}
        </Slider>
      </div>

      <div className="w-full hidden md:grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          return <ItemListStatsContainer key={index} stat={stat} />;
        })}
      </div>
    </>
  );
}

function ItemListStatsContainer({ stat, cardWidth }) {
  const { title, icon, amount, percentage } = stat;

  return (
    <Card>
      <div
        className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground"
        style={{ width: cardWidth ?? "full" }}
      >
        <p>{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">€{amount}</p>
      {percentage != undefined && (
        <p className="text-xs text-green-600 md:text-amber-500">
          {percentage}% dal mese scorso
        </p>
      )}
    </Card>
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
            <ButtonIcon
              onClick={handleClick}
              icon={<ArrowRight />}
              color={"trasparent"}
            ></ButtonIcon>
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
  let expensesList = ["", "", "", "", "", "", "", "", ""];

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
  return <PercentageBar title={"test"} percentage={30} />;
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
