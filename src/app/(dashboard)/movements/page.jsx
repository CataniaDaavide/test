"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as React from "react";
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
import { Calendar, Clock, Euro } from "lucide-react";
import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
              data: {
                date: "2025-01-01",
                time: "18:42",
              },
            })
          }
        >
          Apri dialog movement
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
  const totalVisitors = React.useMemo(() => {
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
  // const data = {
  //   date: "2025-01-01",
  //   time: "",
  //   category: "",
  //   accountOne: "",
  //   amountOne: "",
  //   accountTwo: "",
  //   amountTwo: "",
  // };

  const [date, setDate] = useState(formatDate(dialog.data?.date, "yyyy-MM-dd"));
  const [time, setTime] = useState(formatDate(dialog.data?.time, "HH:mm"));

  const [category, setCategory] = useState();
  // variabili conto1 e importo1
  const [accountOne, setAccountOne] = useState();
  const [amountOne, setAmountOne] = useState("");

  // variabile per gestire se account1 è un buono
  const [isVoucher, setIsVoucher] = useState(true);

  // variabili conto2 e importo2
  const [accountTwo, setAccountTwo] = useState();
  const [amountTwo, setAmountTwo] = useState("");

  const [description, setDescription] = useState("");

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
            {true != undefined ? "Modifica movimento" : "Creazione movimento"}
          </DialogTitle>
          <DialogDescription>
            {true
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
                variant="secondary"
                className="border-0!"
              />
              <Input
                id="time"
                label={"Orario"}
                required
                type="time"
                iconLeft={<Clock />}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                variant="secondary"
                className="border-0!"
              />
              <div className="grid col-span-2">
                <SelectCustom
                  label={"Categoria"}
                  required
                  value={category}
                  setValue={setCategory}
                  options={Array.from({ length: 5 }, (_, i) => ({
                    value: "value" + i,
                    label: "label" + i,
                  }))}
                />
              </div>
              <div className="grid col-span-2">
                <SelectCustom
                  label={"Conto"}
                  required
                  search
                  value={accountOne}
                  setValue={setAccountOne}
                  options={Array.from({ length: 5 }, (_, i) => ({
                    value: "value" + i,
                    label: "label" + i,
                  }))}
                />
              </div>
              <div className="grid col-span-2">
                <Input
                  label={"Importo"}
                  iconLeft={<Euro />}
                  value={amountOne}
                  onChange={(e) => setAmountOne(e.target.value)}
                  placeholder="0,00"
                  variant="secondary"
                  className="border-0!"
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
                      iconLeft={<Euro />}
                      value={amountTwo}
                      onChange={(e) => setAccountTwo(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="secondary"
                  className="border-0!"
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer fisso */}
        <DialogFooter className={"grid grid-cols-2 gap-3"}>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
