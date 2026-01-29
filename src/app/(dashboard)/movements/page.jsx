"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FadeUp } from "@/components/fade-up";
import { Button } from "@/components/ui/button";
import { useError } from "@/context/ErrorContext";
import { ApiClient } from "@/lib/api-client";
import { useDialogCustom } from "@/context/DialogCustomContext";
import { Input } from "@/components/ui/input";
import { SelectCustom } from "@/components/select-custom";
import { Calendar, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoader } from "@/context/LoaderContext";
import { mockupCategories } from "@/data/temp-data";

export default function TestPage() {
  const { setDialog } = useDialogCustom();
  return (
    <ScrollArea className="flex-1 min-h-0 w-full p-6" noscrollbar>
      <FadeUp className="flex flex-col gap-3">
        <ChartPieDonutText />
        <TestApiGet />
        <TestApiPost />
        <Button
          onClick={() =>
            setDialog({
              show: true,
              type: "movement",
              data: {},
            })
          }
        >
          NEW MOVEMENT
        </Button>
        <Button
          onClick={() =>
            setDialog({
              show: true,
              type: "movement",
              data: {
                id: "684aa945bbfb7d771580dc71",
                userId: "682e280409285bb856379161",
                date: "2025-06-12T10:16:00.000Z",
                description:
                  "Vestiti fazione uomo e donna per Martini Andrea lellod 367737053355442176",
                categoryId: "683c3a5aaed32a11ec7e005f",
                type: "U",
                accounts: [
                  {
                    accountId: "683c3ad0aed32a11ec7e0068",
                    amount: 20,
                  },
                ],
              },
            })
          }
        >
          EDIT MOVEMENT
        </Button>
      </FadeUp>
    </ScrollArea>
  );
}

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
};

export function ChartPieDonutText() {
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TestApiGet() {
  const { setError } = useError();

  const handleClick = async (e) => {
    try {
      e.preventDefault();

      const api = new ApiClient();
      const response = await api.get(
        "https://jsonplaceholder.typicode.com/users",
        3000,
      );

      setError({
        title: "Chiamata API ok",
        status: "success",
        description: JSON.stringify(response),
      });
    } catch (e) {
      setError({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    }
  };

  return <Button onClick={handleClick}>Click api get</Button>;
}
function TestApiPost() {
  const { setError } = useError();

  const handleClick = async (e) => {
    try {
      e.preventDefault();

      const api = new ApiClient();
      const response = await api.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          name: "Luca Bianchi",
          username: "lbianchi",
          email: "luca@test.com",
          address: { city: "Milan" },
        },
        3000,
      );

      setError({
        title: "Chiamata API ok",
        status: "success",
        description: JSON.stringify(response),
      });
    } catch (e) {
      setError({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    }
  };

  return <Button onClick={handleClick}>Click api get</Button>;
}

export function DialogCreateOrEditMovement() {
  const { dialog, setDialog } = useDialogCustom();
  const { setLoader } = useLoader();

  const {
    id,
    userId,
    date: movementDate,
    description: movementDesc,
    categoryId,
    type,
    accounts,
  } = dialog.data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const tempCategory = [];
        mockupCategories.map((c) => {
          const categoryOption = {
            label: `${c.emoji} ${c.name} - ${c.type === "E" ? "entrata" : "uscite"}`,
            value: c.id,
          };

          if (categoryId && c.id === categoryId) {
            setCategory(categoryOption);
          }

          tempCategory.push(categoryOption);
        });

        setCategories(tempCategory);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);

  const [categories, setCategories] = useState([]);

  const [date, setDate] = useState(formatDate(movementDate, "yyyy-MM-dd"));
  const [time, setTime] = useState(formatDate(movementDate, "HH:mm"));

  const [category, setCategory] = useState();

  // variabili conto1 e importo1
  const [accountOne, setAccountOne] = useState();
  const [amountOne, setAmountOne] = useState("");

  // variabile per gestire se account1 è un buono
  const [isVoucher, setIsVoucher] = useState(false);

  // variabili conto2 e importo2
  const [accountTwo, setAccountTwo] = useState();
  const [amountTwo, setAmountTwo] = useState("");

  const [description, setDescription] = useState(movementDesc ?? "");

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
          <DialogTitle>
            {id ? "Modifica movimento" : "Creazione movimento"}
          </DialogTitle>
          <DialogDescription>
            {id
              ? "Modifica i dettagli del movimento selezionato"
              : "Inserisci i dettagli per registrare un nuovo movimento"}
          </DialogDescription>
        </DialogHeader>

        {/* Contenuto scrollabile */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full overflow-y-auto pr-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="date"
                label={"Data"}
                required
                type="date"
                iconLeft={<Calendar />}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                variant="outline"
              />
              <Input
                id="time"
                label={"Orario"}
                required
                type="time"
                iconLeft={<Clock />}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                variant="outline"
              />
              <div className="grid col-span-2">
                <SelectCustom
                  label={"Categoria"}
                  required
                  value={category}
                  setValue={setCategory}
                  classNameTrigger={"border-1! bg-transparent! hover:bg-transparent!"}
                />
              </div>
              <div className="grid col-span-2">
                <SelectCustom
                  label={"Conto"}
                  required
                  value={accountOne}
                  setValue={setAccountOne}
                  options={Array.from({ length: 5 }, (_, i) => ({
                    value: "value" + i,
                    label: "label" + i,
                  }))}
                  classNameTrigger={"border-1! bg-transparent! hover:bg-transparent!"}
                />
              </div>
              <div className="grid col-span-2">
                <Input
                  label={"Importo"}
                  value={amountOne}
                  onChange={(e) => setAmountOne(e.target.value)}
                  placeholder="0,00"
                  variant="outline"
                />
              </div>
              {isVoucher && (
                <>
                  <div className="grid col-span-2">
                    <SelectCustom
                      label={"Conto2"}
                      required
                      search
                      value={accountTwo}
                      setValue={setAccountTwo}
                      options={Array.from({ length: 5 }, (_, i) => ({
                        value: "value" + i,
                        label: "label" + i,
                      }))}
                    />
                  </div>
                  <div className="grid col-span-2">
                    <Input
                      label={"Importo2"}
                      value={amountTwo}
                      onChange={(e) => setAmountTwo(e.target.value)}
                      placeholder="0,00"
                      variant="secondary"
                      className="border-0!"
                    />
                  </div>
                </>
              )}
              <div className="grid col-span-2">
                <Input
                  label={"Descrizione"}
                  type="textarea"
                  placeholder="Inserisci descrizione"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outline"
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer fisso */}
        <DialogFooter className={cn(id ? "grid grid-cols-2 gap-3" : "w-full")}>
          {id ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className={"bg-secondary! border-0!"}
                onClick={() => setDialog(null)}
              >
                Modifica
              </Button>
              <Button variant="destructive" size="lg" className={"bg-red-500!"}>
                Elimina
              </Button>
            </>
          ) : (
            <Button className="w-full" variant="secondary" size="lg">
              Crea
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
