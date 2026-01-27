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

export default function TestPage() {
  const { setDialog } = useDialogCustom();

  return (
    <ScrollArea className="flex-1 min-h-0 w-full p-6" noscrollbar>
      <FadeUp className="flex flex-col gap-3">
        <ChartPieDonutText />
        <TestApiGet />
        <TestApiPost />
        <Button
          onClick={() => {
            setDialog({
              title: "Conferma azione",
              description: "Questa operazione è irreversibile",
              content: (
                <div className="grid grid-cols-2 gap-3">
                  <Input label={"Data"} required type="date" />
                  <Input label={"Orario"} required type="time" />
                  <div className="grid col-span-2">
                    <Input label={"Categoria"} required />
                  </div>
                  <div className="grid col-span-2">
                    <Input label={"Conto"} required />
                  </div>
                  <div className="grid col-span-2">
                    <Input label={"Importo (€)"} />
                  </div>
                  <div className="grid col-span-2">
                    <Input label={"Descrizione"} />
                  </div>
                </div>
              ),
              actions: (
                <div className="grid col-span-2">
                  <Button variant="outline" onClick={() => setDialog(null)}>
                    Crea
                  </Button>
                </div>
              ),
            });
          }}
        >
          DIALOG NEW
        </Button>
        <Button
          onClick={() => {
            setDialog({
              title: "Conferma azione",
              description: "Questa operazione è irreversibile",
              content: (
                <div className="grid grid-cols-2 gap-3">
                  <Input label={"Data"} required type="date" />
                  <Input label={"Orario"} required type="time" />
                  <div className="grid col-span-2">
                    <Input label={"Categoria"} required />
                  </div>
                  <div className="grid col-span-2">
                    <Input label={"Conto"} required />
                  </div>
                  <div className="grid col-span-2">
                    <Input label={"Importo (€)"} />
                  </div>
                  <div className="grid col-span-2">
                    <Input label={"Descrizione"} />
                  </div>
                </div>
              ),
              actions: (
                <>
                  <Button variant="outline" onClick={() => setDialog(null)}>
                    Modifica
                  </Button>
                  <Button variant="destructive">Elimina</Button>
                </>
              ),
            });
          }}
        >
          DIALOG EDIT
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
