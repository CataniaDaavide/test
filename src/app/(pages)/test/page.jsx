"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useMessage } from "@/context/MessageContext";

export default function TestPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-3 items-center p-6">
      <h1 className="text-5xl font-bold">TEST PAGE</h1>

      <div className="w-full h-20 bg-red-500" onClick={() => setOpen(!open)} />
      <div className="w-full flex flex-col gap-3">
        <motion.div
          className="w-full h-20 bg-yellow-500"
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-full h-20 bg-blue-500"
          animate={{ y: open ? 0 : -90 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p>{open ? "true" : "false"}</p>

      {/* <ChartPieDonutText /> */}

      <ButtonsTest />
    </div>
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

function ButtonsTest() {
  const { setMessage } = useMessage();

  return (
    <div className="grid grid-cols-2 gap-5">
      <Button
        className={"w-full"}
        variant="secondary"
        onClick={() => {
          setMessage({
            title: "Messaggio",
            status: "info",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.",
          });
        }}
      >
        dialog info
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setMessage({
            title: "Messaggio",
            status: "warning",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.",
          });
        }}
      >
        dialog warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setMessage({
            title: "Messaggio",
            status: "error",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.",
          });
        }}
      >
        dialog error
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setMessage({
            title: "Messaggio",
            status: "success",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident aut voluptate, quia possimus ducimus eos eum itaque dignissimos voluptatibus culpa sed ea tempora vel, dicta, labore non aliquid cupiditate. Explicabo.",
          });
        }}
      >
        dialog success
      </Button>
    </div>
  );
}
