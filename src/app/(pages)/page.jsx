"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Tag } from "lucide-react";
import Input from "../components/ui/input";
import { Button } from "../components/ui/button/button";
import { Card } from "../components/ui/card";
import { ExampleSelectComponent } from "../components/ui/select";
import { convertDate } from "../core/baseFunctions";
import { ExampleTabsComponents } from "../components/ui/tabs";
 
export default function App() {
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
    <div className="w-full h-full max-w-md p-3 flex flex-col gap-3 items-center justify-center">
      <p>App page</p>
      <p className="text-muted-foreground">
        Uso questa pagina come test per i componenti
      </p>
      <ExampleTabsComponents />
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
        <Button
          onClick={handleClick}
          title={"Stampa value"}
          color={"primary"}
        />
        <Button onClick={handleReset} title={"Reset value"} />
        {val && (
          <Card>
            <p className="whitespace-pre-line text-center">{val}</p>
          </Card>
        )}
      </Card>
    </div>
  );
}
