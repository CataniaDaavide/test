"use client";

import Emoji from "@/app/components/emoji";
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
import { convertDate, fetchApi } from "@/app/core/baseFunctions";
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

function movementsFilteredByDate(data = [], start, end) {
  const dateStart = new Date(start);
  const dateEnd = new Date(end);
  if (dateStart == "Invalid Date" || dateEnd == "Invalid Date") {
    return [];
  }

  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= dateStart && itemDate <= dateEnd;
  });
}

function calculateTotalIncomeAndExpenses(
  dateStart,
  dateEnd,
  movements,
  base_exceptionManager
) {
  try {
    const income = [];
    const expense = [];
    var totalIncome = 0;
    var totalExpense = 0;

    const movementsFiltered = movementsFilteredByDate(
      movements,
      dateStart,
      dateEnd
    );

    movementsFiltered.map((item) => {
      if (item.type === "E") {
        income.push(item);
        item.accounts.map((acc) => {
          totalIncome += acc.amount;
        });
      } else if (item.type) {
        expense.push(item);
        item.accounts.map((acc) => {
          totalExpense += acc.amount;
        });
      }
    });

    return {
      income: income,
      expense: expense,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
    };
  } catch (error) {
    base_exceptionManager(error);
  }
}

function calculatePercentChange(current, previous) {
  if (previous === 0) {
    if (current === 0) return 0; // nessun cambiamento
    return Infinity; // crescita non definita (da 0 a >0)
  }
  const change = ((current - previous) / previous) * 100;
  return change.toFixed(2); // es. 25 significa +25%, -10 significa -10%
}

// -----------------------------------------------------------------

export default function DashboardPage() {
  const { modal } = useContext(ModalContext);
  const { base_exceptionManager } = useExceptionManager();
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  // recupero movimenti
  const loadMovements = async () => {
    setIsLoader(true);
    const now = new Date();

    // dateEnd = ultimo giorno del mese corrente alle 23:59:59
    const dateEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      0
    );

    // dateStart = primo giorno del mese 3 mesi fa alle 00:00:00
    const startMonth = now.getMonth() - 3;
    const startYear = now.getFullYear() + Math.floor(startMonth / 12);
    const normalizedStartMonth = (startMonth + 12) % 12; // gestisce i mesi negativi

    const dateStart = new Date(startYear, normalizedStartMonth, 1, 0, 0, 0, 0);

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

  // recupero categorie
  const loadCategories = async () => {
    setIsLoader(true);

    await fetchApi("/api/categories/categoriesGet", "POST", {}, async (res) => {
      const data = await res.json();

      if (!res.ok && data.error != "") {
        base_exceptionManager({ message: data.error });
        return;
      }

      const { categories } = data;
      setCategories(categories);
    });
    setIsLoader(false);
  };

  // recupero conti
  const loadAccounts = async () => {
    await fetchApi("/api/accounts/accountsGet", "POST", {}, async (res) => {
      const data = await res.json();

      if (!res.ok && data.error != "") {
        base_exceptionManager({ message: data.error });
        return;
      }

      const { accounts } = data;
      setAccounts(accounts);
      // var total = 0;
      // accounts.map((item) => {
      //   total += item.amount;
      // });
      // setTotalAccounts(total.toFixed(2).toString().replace(".", ","));
    });
  };

  // evento che gestisce il recupero dei dati quando la pagina viene renderizzata
  // e quando viene chiuso il modal
  useEffect(() => {
    if (modal && modal.show === false) {
      // funzione per recupero le categorie
      loadMovements();
      loadCategories();
      loadAccounts();
    }
  }, [modal]);

  // calcolo dati mese corrente
  const now = new Date();
  const startOfCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endOfCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      {/* <StatsContainer
        movements={movements}
        accounts={accounts}
        startOfCurrentMonth={startOfCurrentMonth}
        endOfCurrentMonth={endOfCurrentMonth}
      /> */}
      {/* <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 pb-3"> */}
      <RecentMovementsContainer
        movements={movements}
        categories={categories}
        accounts={accounts}
        startOfCurrentMonth={startOfCurrentMonth}
        endOfCurrentMonth={endOfCurrentMonth}
      />
      {/* <OtherStastsContainer movements={movements} /> */}
      {/* </div> */}
    </div>
  );
}

function StatsContainer({
  movements = [],
  accounts = [],
  startOfCurrentMonth = new Date(),
  endOfCurrentMonth = new Date(),
}) {
  const { base_exceptionManager } = useExceptionManager();
  const [totalAccounts, setTotalAccounts] = useState(0);
  // const containerRef = useRef(null);
  // const [width, setWidth] = useState(0);

  // useEffect(() => {
  //   setWidth(containerRef.current.offsetWidth);
  // }, [containerRef]);

  // evento per calcolare il tolale dei soldi disponibili nei vari accounts
  useEffect(() => {
    if (accounts.length > 0) {
      var total = 0;
      accounts.map((item) => {
        total += item.amount;
      });
      setTotalAccounts(total.toFixed(2).toString().replace(".", ","));
    }
  }, [accounts]);

  // calcolo dati mese precedente
  const now = new Date();
  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
    0
  );
  const endOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  const {
    income: currentIncome,
    expense: currentExpense,
    totalIncome: currentTotaleIncome,
    totalExpense: currentTotaleExpense,
  } = calculateTotalIncomeAndExpenses(
    startOfCurrentMonth,
    endOfCurrentMonth,
    movements,
    base_exceptionManager
  );
  const {
    income: previusIncome,
    expense: previusExpense,
    totalIncome: previusTotaleIncome,
    totalExpense: previusTotaleExpense,
  } = calculateTotalIncomeAndExpenses(
    startOfPreviousMonth,
    endOfPreviousMonth,
    movements,
    base_exceptionManager
  );

  const stats = [
    {
      title: "Entrate del mese",
      amount: currentTotaleIncome.toString().replace(".", ","),
      icon: <TrendingUp size={16} />,
      type: "E",
      percentage: calculatePercentChange(
        currentTotaleIncome,
        previusTotaleIncome
      ),
    },
    {
      title: "Uscite del mese",
      amount: currentTotaleExpense.toString().replace(".", ","),
      icon: <TrendingDown size={16} />,
      type: "U",
      percentage: calculatePercentChange(
        currentTotaleExpense,
        previusTotaleExpense
      ),
    },
    {
      title: "Saldo Totale",
      amount: totalAccounts,
      icon: <Wallet size={16} />,
    },
    {
      title: "Obiettivi ???",
      amount: 0,
      icon: <Target size={16} />,
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
  const { title, icon, amount, percentage, type } = stat;
  let percentageColor = "";

  if (type === "E") {
    if (percentage >= 0) {
      percentageColor = "text-green-600";
    } else {
      percentageColor = "text-red-600";
    }
  } else {
    if (percentage >= 0) {
      percentageColor = "text-red-600";
    } else {
      percentageColor = "text-green-600";
    }
  }

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
        <p className={`text-sm ${percentageColor}`}>
          {percentage}% dal mese scorso
        </p>
      )}
    </Card>
  );
}

function RecentMovementsContainer({
  movements = [],
  categories = [],
  accounts = [],
  startOfCurrentMonth = new Date(),
  endOfCurrentMonth = new Date(),
}) {
  const { base_exceptionManager } = useExceptionManager();
  const router = useRouter();

  const movementsFiltered = movementsFilteredByDate(
    movements,
    startOfCurrentMonth,
    endOfCurrentMonth
  ).slice(0, 10);

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
          {movementsFiltered.map((movement, index) => {
            return (
              <MovementsCard
                key={index}
                data={movement}
                categories={categories}
              />
            );
          })}
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

function MovementsCard({ data, categories = [] }) {
  const { base_exceptionManager } = useExceptionManager();
  const { setModal } = useContext(ModalContext);
  const { _id, userId, type, description, date, categorieId, accounts, name } =
    data;
  const amount = accounts.reduce((acc, x) => acc + x.amount, 0);
  const [categorie, setCategorie] = useState(null);

  const convertedDate = convertDate(date, "dd/MM/yyyy HH:mm")
  const truncatedDdescription = description.length > 30 ? description.slice(0,50) + "..." : description
  const colorAmount = type === "E" ? "text-green-600" : "text-red-600"
          
  useEffect(() => {
    const found = categories.find((c) => c._id === categorieId);
    setCategorie(found || null);
  }, [categories, categorieId]);

  if (!categorie) return null;

  // // click sul pulsante modifica
  // const handleEdit = (e) => {
  //   try {
  //     e.preventDefault();

  //     setModal({
  //       show: true,
  //       type: "account",
  //       data: { ...data, handleDelete: handleDelete },
  //     });
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // };

  // // click sul pulsante elimina
  // const handleCloseModal = () => {
  //   try {
  //     setModal({
  //       show: false,
  //       type: "",
  //       data: undefined,
  //     });
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // };

  // // click sul pulsante conferma eliminazione
  // const handleConfirmDelete = async (e) => {
  //   try {
  //     e.preventDefault();
  //     const requestData = {
  //       _id: _id,
  //     };
  //     await fetchApi(
  //       "/api/accounts/accountDelete",
  //       "POST",
  //       requestData,
  //       async (res) => {
  //         const data = await res.json();

  //         if (!res.ok && data.error != "") {
  //           base_exceptionManager({ message: data.error });
  //         } else {
  //           handleCloseModal();
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // };

  // // click sul pulsante elimina
  // const handleDelete = (e) => {
  //   try {
  //     e.preventDefault();
  //     setModal({
  //       show: true,
  //       type: "alert",
  //       data: {
  //         title: "Eliminazione conto",
  //         icon: <TriangleAlert size={40} className="text-amber-600" />,
  //         message: (
  //           <p className="text-muted-foreground">
  //             Sei sicuro di voler eliminare il conto {name}?
  //             <br />
  //             <br />
  //             Cliccando su
  //             <strong className="text-background-inverse ml-1">Elimina</strong>,
  //             il conto verrà rimosso dall’elenco e non sarà più utilizzabile.
  //             <br />
  //             <br />
  //             Le transazioni associate a questo conto resteranno invariate e
  //             continueranno a mostrarla come conto di riferimento.
  //           </p>
  //         ),
  //         buttons: [
  //           "cancel",
  //           <Button onClick={handleConfirmDelete} color={"danger"}>
  //             Elimina
  //           </Button>,
  //         ],
  //       },
  //     });
  //   } catch (error) {
  //     base_exceptionManager(error);
  //   }
  // };

  return (
    <Card className="!flex-row !items-center !justify-between">
      <div className="w-full flex items-center gap-3">
        <Emoji emoji={categorie?.emoji} hexColor={categorie?.hexColor} />
        <div>
          <p className="text-nowrap">{categorie?.name}</p>
          <p className="text-sm text-gray-500">{convertedDate}</p>
          {truncatedDdescription && <p className="text-sm text-gray-500 max-w-[120px] border">
            {truncatedDdescription}
          </p>}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p
          className={`text-lg font-bold md:pr-3 ${colorAmount}`}
        >
          €{amount.toFixed(2)}
        </p>
        {/* <div className="flex gap-1">
          <ButtonIcon
            icon={<Edit />}
            onClick={handleEdit}
            color={"trasparent"}
          />
          <ButtonIcon
            icon={<Trash />}
            onClick={handleDelete}
            color={"danger"}
          />
        </div>  */}
      </div>
    </Card>
  );
}
