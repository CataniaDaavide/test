"use client";

import { useRef, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import Input from "../components/ui/input/input";
import Textarea from "../components/ui/input/text-area";
import { Button } from "../components/ui/button/button";
import { Card } from "../components/ui/card";

export default function App() {
  const dateRef = useRef();
  const timeRef = useRef();
  const messageRef = useRef();
  const [val, setVal] = useState("");

  const handleClick = () => {
    let str = "";
    if (dateRef.current.value) {
      str += dateRef.current.value + "\n";
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
    dateRef.current.value = ""
    timeRef.current.value = ""
    messageRef.current.value = ""
    setVal("")
  }

  return (
    <div className="w-full h-full max-w-md p-3 flex flex-col gap-3 items-center justify-center">
      <p>App page</p>
      <p className="text-muted-foreground">
        Uso questa pagina come test per i componenti
      </p>
      <Card>
        <Input
          icon={<Calendar />}
          title={"Data"}
          type="date"
          name={"data"}
          ref={dateRef}
        />
        <Input
          icon={<Clock />}
          title={"Time"}
          type="time"
          name={"time"}
          ref={timeRef}
        />
        <Textarea rows={2} title={"Textarea"} name={"text"} ref={messageRef} />
        <Button
          onClick={handleClick}
          title={"Stampa value"}
          color={"primary"}
        />
        <Button
          onClick={handleReset}
          title={"Reset value"}
        />
        {val && (
          <Card>
            <p className="whitespace-pre-line text-center">{val}</p>
          </Card>
        )}
      </Card>
    </div>
  );
}
