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
import { ModalContext } from "@/app/context/ModalContext";
import { fetchApi } from "@/app/core/baseFunctions";
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
import { useContext, useEffect, useRef, useState } from "react";

export default function DashboardPage() {
  const { modal } = useContext(ModalContext);
  const { base_exceptionManager } = useExceptionManager();
  const [movements, setMovements] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  // recupero movimenti
  const loadMovements = async () => {
    setIsLoader(true);
    const now = new Date();

    // dateEnd = ultimo giorno del mese corrente alle 23:59:59
    const dateEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    dateEnd.setHours(23, 59, 59, 0);

    // dateStart = primo giorno del mese 3 mesi fa alle 00:00:00
    const startMonth = now.getMonth() - 3;
    const startYear = now.getFullYear() + Math.floor(startMonth / 12);
    const normalizedStartMonth = (startMonth + 12) % 12; // gestisce i mesi negativi

    const dateStart = new Date(startYear, normalizedStartMonth, 1);
    dateStart.setHours(0, 0, 0, 0);

    const requestData = {
      dateStart: dateStart,
      dateEnd: dateEnd,
    };

    await fetchApi(
      "/api/movements/movementsGet",
      "POST",
      requestData,
      async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          base_exceptionManager({ message: data.error });
          return;
        }

        const { movements } = data;
        setMovements(movements);
      }
    );
    setIsLoader(false);
  };

  // evento che gestisce il recupero dei dati quando la pagina viene renderizzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // funzione per recupero le categorie
      loadMovements();
    }
  }, [modal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      <StatsContainer movements={movements} />
      {/* <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 pb-3">
        <RecentMovementsContainer movements={movements} />
        <OtherStastsContainer movements={movements} />
      </div> */}
    </div>
  );
}

function StatsContainer({ movements }) {
  // const containerRef = useRef(null);
  // const [width, setWidth] = useState(0);

  // useEffect(() => {
  //   setWidth(containerRef.current.offsetWidth);
  // }, [containerRef]);

  // calcola inizio e fine del mese corrente
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const filtered = movements.filter((item) => {
    const itemDate = new Date(item.date); // <- importante!
    return itemDate >= startOfMonth && itemDate <= endOfMonth;
  });

  console.log(movements, "filtered:", filtered);

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
      {/* <div className="w-full flex md:hidden">
        <Slider cards={stats} containerRef={containerRef}>
          {stats.map((stat, index) => (
            <ItemListStatsContainer key={index} stat={stat} cardWidth={width} />
          ))}
        </Slider>
      </div> */}

      {/* <div className="w-full hidden md:grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4"> */}
      <div className="w-full grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
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
