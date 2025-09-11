"use client";

import Emoji from "@/app/components/emoji";
import { ButtonIcon } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderActions,
  CardHeaderContent,
  CardTitle,
} from "@/app/components/ui/card";
import LoaderFullPage from "@/app/components/ui/loader-full-page";
import PercentageBar from "@/app/components/ui/percentage-bar";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";
import { ModalContext } from "@/app/context/ModalContext";
import { convertDate, fetchApi } from "@/app/core/baseFunctions";
import { ArrowRight, Calendar, ChartPie, Plus, Target, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

// -----------------------------------------------------------------
// FUNZIONI HELPER FUORI DAI COMPONENTI
// -----------------------------------------------------------------

function filteredMovementsByDate(data = [], start, end) {
  const dateStart = new Date(start);
  const dateEnd = new Date(end);
  if (isNaN(dateStart) || isNaN(dateEnd)) return [];

  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= dateStart && itemDate <= dateEnd;
  });
}

function calculateTotalIncomeAndExpenses(dateStart, dateEnd, movements) {
  const filtered = filteredMovementsByDate(movements, dateStart, dateEnd);

  return filtered.reduce(
    (acc, item) => {
      if (item.type === "E") {
        acc.income.push(item);
        acc.totalIncome += item.accounts.reduce((sum, accItem) => sum + accItem.amount, 0);
      } else if (item.type === "U") {
        acc.expense.push(item);
        acc.totalExpense += item.accounts.reduce((sum, accItem) => sum + accItem.amount, 0);
      }
      return acc;
    },
    { income: [], expense: [], totalIncome: 0, totalExpense: 0 }
  );
}

function calculatePercentChange(current, previous) {
  if (previous === 0) {
    if (current === 0) return 0;
    return Infinity;
  }
  return (((current - previous) / previous) * 100).toFixed(2);
}

// -----------------------------------------------------------------
// COMPONENTE PRINCIPALE
// -----------------------------------------------------------------

export default function DashboardPage() {
  const { modal } = useContext(ModalContext);
  const { base_exceptionManager } = useExceptionManager();
  const [movements, setMovements] = useState();
  const [categories, setCategories] = useState();
  const [accounts, setAccounts] = useState();

  // recupero movimenti
  const loadMovements = async () => {
    const now = new Date();

    const dateEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 0);
    const startMonth = now.getMonth() - 3;
    const startYear = now.getFullYear() + Math.floor(startMonth / 12);
    const normalizedStartMonth = (startMonth + 12) % 12;
    const dateStart = new Date(startYear, normalizedStartMonth, 1, 0, 0, 0, 0);

    const requestData = { dateStart, dateEnd };

    await fetchApi("/api/movements/movementsGet", "POST", requestData, async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        base_exceptionManager({ message: data.error });
        return;
      }
      setMovements(data.movements || []);
    });
  };

  // recupero categorie
  const loadCategories = async () => {
    await fetchApi("/api/categories/categoriesGet", "POST", {}, async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        base_exceptionManager({ message: data.error });
        return;
      }
      setCategories(data.categories || []);
    });
  };

  // recupero conti
  const loadAccounts = async () => {
    await fetchApi("/api/accounts/accountsGet", "POST", {}, async (res) => {
      const data = await res.json();
      if (!res.ok && data.error) {
        base_exceptionManager({ message: data.error });
        return;
      }
      setAccounts(data.accounts || []);
    });
  };

  // caricamento dati quando modal chiude
  useEffect(() => {
    if (modal && modal.show === false) {
      loadMovements();
      loadCategories();
      loadAccounts();
    }
  }, [modal]);

  // calcolo date mese corrente
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  if (!movements || !categories || !accounts) return <LoaderFullPage />;

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3 md:p-5 overflow-y-scroll scrollbar-hide">
      <StatsContainer
        movements={movements}
        accounts={accounts}
        startOfCurrentMonth={startOfCurrentMonth}
        endOfCurrentMonth={endOfCurrentMonth}
      />
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 space-y-3 md:gap-3">
        <RecentMovementsContainer
          movements={movements}
          categories={categories}
          startOfCurrentMonth={startOfCurrentMonth}
          endOfCurrentMonth={endOfCurrentMonth}
        />
        <OtherStastsContainer
          movements={movements}
          startOfCurrentMonth={startOfCurrentMonth}
          endOfCurrentMonth={endOfCurrentMonth}
          categories={categories}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// COMPONENTI FIGLI
// -----------------------------------------------------------------

function StatsContainer({ movements, accounts, startOfCurrentMonth, endOfCurrentMonth }) {
  const { base_exceptionManager } = useExceptionManager();
  const [totalAccounts, setTotalAccounts] = useState(0);

  useEffect(() => {
    if (accounts.length > 0) {
      const total = accounts.reduce((sum, acc) => sum + acc.amount, 0);
      setTotalAccounts(total.toFixed(2).replace(".", ","));
    }
  }, [accounts]);

  const now = new Date();
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const { totalIncome: currentTotaleIncome, totalExpense: currentTotaleExpense } = calculateTotalIncomeAndExpenses(
    startOfCurrentMonth,
    endOfCurrentMonth,
    movements
  );
  const { totalIncome: previusTotaleIncome, totalExpense: previusTotaleExpense } = calculateTotalIncomeAndExpenses(
    startOfPreviousMonth,
    endOfPreviousMonth,
    movements
  );

  const stats = [
    {
      title: "Entrate del mese",
      amount: currentTotaleIncome.toString().replace(".", ","),
      icon: <TrendingUp size={16} />,
      type: "E",
      percentage: calculatePercentChange(currentTotaleIncome, previusTotaleIncome),
    },
    {
      title: "Uscite del mese",
      amount: currentTotaleExpense.toString().replace(".", ","),
      icon: <TrendingDown size={16} />,
      type: "U",
      percentage: calculatePercentChange(currentTotaleExpense, previusTotaleExpense),
    },
    { title: "Saldo totale", amount: totalAccounts, icon: <Wallet size={16} /> },
    // { title: "Obiettivi ???", amount: 0, icon: <Target size={16} /> },
  ];

  return (
    <div className="w-full grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <ItemListStatsContainer key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}

function ItemListStatsContainer({ stat, index }) {
  const { title, icon, amount, percentage, type } = stat;
  let percentageColor = "";

  if (type === "E") {
    percentageColor = percentage >= 0 ? "text-green-600" : "text-red-600";
  } else if (type === "U") {
    percentageColor = percentage >= 0 ? "text-red-600" : "text-green-600";
  }

  return (
      <Card>
        <div className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground">
          <p>{title}</p>
          {icon}
        </div>
        <p className="text-2xl font-bold">€ {amount}</p>
        {percentage !== undefined && <p className={`text-sm ${percentageColor}`}>{percentage}% dal mese scorso</p>}
      </Card>
  );
}

function RecentMovementsContainer({ movements, categories, startOfCurrentMonth, endOfCurrentMonth }) {
  const { base_exceptionManager } = useExceptionManager();
  const router = useRouter();

  const filteredMovements = filteredMovementsByDate(movements, startOfCurrentMonth, endOfCurrentMonth).slice(0, 10);

  const handleClick = () => {
    try {
      router.push("/dashboard/movements");
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <div
      className="h-full grid col-span-2 mt-5 md:m-0"
     >
      <Card className="w-full !bg-transparent !border-0 !p-0 md:!bg-card md:!border-1 md:!p-5">
        <CardHeader>
          <CardHeaderContent>
            <CardTitle>Movimenti recenti</CardTitle>
            <CardDescription>Ultimi 10 movimenti</CardDescription>
          </CardHeaderContent>
          <CardHeaderActions>
            <ButtonIcon onClick={handleClick} icon={<ArrowRight />} color={"transparent"} />
          </CardHeaderActions>
        </CardHeader>

        <CardContent>
          {filteredMovements.map((movement, index) => (
            <MovementsCard key={index} data={movement} categories={categories} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MovementsCard({ data, categories = [] }) {
  const { type, description, date, categorieId, accounts } = data;
  const amount = accounts.reduce((acc, x) => acc + x.amount, 0);
  const [categorie, setCategorie] = useState(null);
  const convertedDate = convertDate(date, "dd/MM/yyyy HH:mm");
  const colorAmount = type === "E" ? "text-green-600" : "text-red-600";
  const sign = type === "E" ? "+" : "-";

  useEffect(() => {
    const found = categories.find((c) => c._id === categorieId);
    setCategorie(found || null);
  }, [categories, categorieId]);

  if (!categorie) return null;

  return (
    <Card className="!flex-row !items-center !justify-between">
      <div className="w-full flex items-center gap-3">
        <Emoji emoji={categorie?.emoji} hexColor={categorie?.hexColor} />
        <div className="max-w-[120px] md:max-w-[300px]">
          <p className="text-nowrap">{categorie?.name}</p>
          <p className="text-sm text-gray-500">{convertedDate}</p>
          <p className="text-sm text-gray-500 truncate">{description}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className={`text-lg font-bold md:pr-3 text-nowrap ${colorAmount}`}>
          {sign} € {amount.toFixed(2).replace(".",",")}
        </p>
      </div>
    </Card>
  );
}

function OtherStastsContainer({ movements, startOfCurrentMonth, endOfCurrentMonth, categories }) {
  const filteredMovements = filteredMovementsByDate(movements, startOfCurrentMonth, endOfCurrentMonth);

  return (
    <div className="w-full flex flex-col gap-3">
      <ExpensesByCategory movements={filteredMovements} categories={categories} />
      <MonthlyIncomeExpenseComparison movements={movements} />
    </div>
  );
}

function ExpensesByCategory({ movements, categories }) {
  const filteredCategories = new Map();
  let totalExpense = 0;

  categories.forEach((c) => {
    if (c.type === "U") {
      filteredCategories.set(c._id, { ...c, totalAmount: 0 });
    }
  });

  movements.forEach((m) => {
    if (m.type === "U") {
      const totalAccounts = m.accounts.reduce((acc, x) => acc + x.amount, 0);
      const categorie = filteredCategories.get(m.categorieId);

      if (categorie) {
        categorie.totalAmount += totalAccounts;
        totalExpense += totalAccounts;
        filteredCategories.set(m.categorieId, categorie);
      }
    }
  });

  const categoriesArray = Array.from(filteredCategories.values());

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
        {categoriesArray.length ? (
          <>
            {categoriesArray.map(
              (item, index) =>
                item.totalAmount !== 0 && (
                  <ItemListExpensesByCategory key={index} data={item} totalExpense={totalExpense} />
                )
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Nessun movimento trovato</p>
        )}
      </CardContent>
    </Card>
  );
}

function ItemListExpensesByCategory({ data, totalExpense }) {
  const { name, totalAmount } = data;
  const percentage = totalExpense > 0 ? ((totalAmount / totalExpense) * 100).toFixed(2) : 0;

  return (
    <PercentageBar
      titleSx={name}
      titleDx={`€ ${totalAmount.toFixed(2).replace(".", ",")}`}
      percentage={totalAmount === 0 ? totalAmount : percentage}
    />
  );
}

function MonthlyIncomeExpenseComparison({ movements }) {
  // Mese corrente
  const currentMonthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0);
  const currentMonthEndDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
  const { totalIncome: currentMonthTotalIncome, totalExpense: currentMonthTotalExpense } =
    calculateTotalIncomeAndExpenses(currentMonthStartDate, currentMonthEndDate, movements);
  let currentMonthName = currentMonthStartDate.toLocaleString("it-IT", { month: "long" });
  currentMonthName = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1, 3);

  // Un mese fa
  const previousMonthStartDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0, 0);
  const previousMonthEndDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59, 999);
  const { totalIncome: previousMonthTotalIncome, totalExpense: previousMonthTotalExpense } =
    calculateTotalIncomeAndExpenses(previousMonthStartDate, previousMonthEndDate, movements);
  let previousMonthName = previousMonthStartDate.toLocaleString("it-IT", { month: "long" });
  previousMonthName = previousMonthName.charAt(0).toUpperCase() + previousMonthName.slice(1, 3);

  // Due mesi fa
  const twoMonthsAgoStartDate = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1, 0, 0, 0, 0);
  const twoMonthsAgoEndDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0, 23, 59, 59, 999);
  const { totalIncome: twoMonthsAgoTotalIncome, totalExpense: twoMonthsAgoTotalExpense } =
    calculateTotalIncomeAndExpenses(twoMonthsAgoStartDate, twoMonthsAgoEndDate, movements);
  let twoMonthsAgoName = twoMonthsAgoStartDate.toLocaleString("it-IT", { month: "long" });
  twoMonthsAgoName = twoMonthsAgoName.charAt(0).toUpperCase() + twoMonthsAgoName.slice(1, 3);

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
        <ItemListMonthlyIncomeExpenseComparison
          monthName={currentMonthName}
          totalIncome={currentMonthTotalIncome}
          totalExpanse={currentMonthTotalExpense}
        />
        <ItemListMonthlyIncomeExpenseComparison
          monthName={previousMonthName}
          totalIncome={previousMonthTotalIncome}
          totalExpanse={previousMonthTotalExpense}
        />
        <ItemListMonthlyIncomeExpenseComparison
          monthName={twoMonthsAgoName}
          totalIncome={twoMonthsAgoTotalIncome}
          totalExpanse={twoMonthsAgoTotalExpense}
        />
      </CardContent>
    </Card>
  );
}

function ItemListMonthlyIncomeExpenseComparison({ monthName, totalIncome, totalExpanse }) {
  const color = totalIncome - totalExpanse > 0 ? "text-green-600" : "text-red-600";
  const netBalance = totalIncome - totalExpanse; //.toFixed(2).replace(".", ",")
  const netBalanceStr = netBalance.toFixed(2).replace(".", ",");
  return (
    <div className="flex flex-col gap-1 text-sm font-medium">
      <div className="flex justify-between">
        <p>{monthName}</p>
        <p className={`font-bold ${color}`}>{netBalance >= 0 ? `€ ${netBalanceStr}` : `- € ${netBalanceStr.slice(1)}`}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-muted-foreground">Entrate: €{totalIncome.toFixed(2).replace(".", ",")}</p>
        <p className="text-xs text-muted-foreground">Uscite: €{totalExpanse.toFixed(2).replace(".", ",")}</p>
      </div>
    </div>
  );
}
