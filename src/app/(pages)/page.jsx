"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Plus, Tag } from "lucide-react";
import Input from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ExampleSelectComponent } from "../components/ui/select";
import { convertDate } from "../core/baseFunctions";
import Tabs from "../components/ui/tabs";
import ButtonToggleTheme from "../components/ui/toggle-theme";

export default function App() {
  const tabs = [
    {
      value: "card test",
      tab: <CardTest />,
    },
    {
      value: "button",
      tab: <AllButtons />,
    },
  ];
  const [value, setValue] = useState(tabs[0]);

  return (
    <div className="w-full h-full max-w-md p-3 flex flex-col gap-3 items-center justify-center">
      <ButtonToggleTheme
        className={"absolute top-3 right-3 !rounded-full"}
        color={"trasparent"}
      />
      <p>App page</p>
      <p className="text-muted-foreground">
        Uso questa pagina come test per i componenti
      </p>
      <Tabs tabs={tabs} value={value} setValue={setValue} />
      {value.tab}
    </div>
  );
}

function CardTest() {
  const dateRef = useRef();
  const timeRef = useRef();
  const messageRef = useRef();
  const [val, setVal] = useState("");

  useEffect(() => {
    dateRef.current.value = convertDate(new Date(), "yyyy-MM-dd");
    timeRef.current.value = convertDate(new Date(), "HH:mm");
  }, []);

  const handleClick = () => {
    let str = "";
    if (dateRef.current.value) {
      str += convertDate(new Date(dateRef.current.value), "dd/MM/yyyy") + "\n";
    }
    if (timeRef.current.value) {
      str += timeRef.current.value + "\n";
    }
    if (messageRef.current.value) {
      str += messageRef.current.value + "\n";
    }
    setVal(str);
  };

  const handleReset = () => {
    dateRef.current.value = "";
    timeRef.current.value = "";
    messageRef.current.value = "";
    setVal("");
  };

  return (
    <Card>
      <div className="w-full flex gap-3">
        <Input
          icon={<Calendar />}
          title={"Data"}
          type={"date"}
          name={"data"}
          ref={dateRef}
        />
        <Input
          icon={<Clock />}
          title={"Time"}
          type={"time"}
          name={"time"}
          ref={timeRef}
        />
      </div>
      <Input
        title={"Textarea"}
        type={"textarea"}
        name={"textarea"}
        rows={3}
        ref={messageRef}
      />
      <ExampleSelectComponent />
      <Button onClick={handleClick} color={"primary"}>
        Stampa value
      </Button>
      <Button onClick={handleReset}>Reset value</Button>
      {val && (
        <Card>
          <p className="whitespace-pre-line text-center">{val}</p>
        </Card>
      )}
    </Card>
  );
}

function AllButtons() {
  return (
    <Card>
      <p>all buttons</p>
      <Button>
        <Plus />
        <p>ciao</p>
      </Button>
      <Button color={"primary"}>
        <Plus />
        <p>ciao</p>
      </Button>
      <Button color={"success"}>
        <Plus />
        <p>ciao</p>
      </Button>
      <Button color={"danger"}>
        <Plus />
        <p>ciao</p>
      </Button>
      <Button color={"outline"}>
        <Plus />
        <p>ciao</p>
      </Button>
    </Card>
  );
}
