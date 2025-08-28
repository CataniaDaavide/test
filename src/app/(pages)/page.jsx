"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Calendar, Clock, Plus, Tag, Wallet } from "lucide-react";
import Input from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, ExampleCard } from "../components/ui/card";
import Select, { ExampleSelectComponent } from "../components/ui/select";
import { convertDate } from "../core/baseFunctions";
import Tabs from "../components/ui/tabs";
import ButtonToggleTheme from "../components/ui/toggle-theme";
import { CardSliderTest } from "../components/ui/slider";
import { ModalContext } from "../context/ModalContext";

export default function App() {
  const tabs = [
    {
      value: "aaa",
      tab: <ExampleCard />,
    },
    {
      value: "CardSlider",
      tab: <CardSliderTest />,
    },
    {
      value: "card test",
      tab: <CardTest />,
    },
    {
      value: "inputs/select",
      tab: <AllInput />,
    },
    {
      value: "buttons",
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
  const { setModal } = useContext(ModalContext);
  const showErrorModal = () => {
    setModal({
      show: true,
      type: "error",
      data: {
        title: "ModalError",
        desciption: "Lorem Ipsum is simply dummy text of the printing",
        message:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      },
    });
  };

  const showTransictionModal = () => {
    setModal({
      show: true,
      type: "transiction",
      data: {
        title: "ModalTransiction",
        description: "Registra una nuova entrata o uscita"
      },
    });
  };

  return (
    <>
      <p>all buttons</p>
      <Button>
        <Plus />
        <p>ciao</p>
      </Button>
      <Button color={"primary"}>
        <Plus />
        <p>ciao</p>
      </Button>
      <Button onClick={showTransictionModal} color={"success"}>
        <Plus />
        <p>showTransictionModal</p>
      </Button>
      <Button onClick={showErrorModal} color={"danger"}>
        <Plus />
        <p>showErrorModal</p>
      </Button>
      <Button color={"outline"}>
        <Plus />
        <p>ciao</p>
      </Button>
    </>
  );
}

function AllInput() {
  const inputRef = useRef();
  const options = [
    { value: "ciao1", data: {} },
    { value: "ciao2", data: {} },
    { value: "ciao3", data: {} },
    { value: "ciao4", data: {} },
    { value: "ciao5", data: {} },
  ];
  const [value, setValue] = useState({});

  return (
    <>
      <p>all inputs</p>
      <Card>
        <Input
          title={"Default color"}
          type="password"
          icon={<Wallet />}
          ref={inputRef}
        />
      </Card>
      <Input
        title={"Primary color"}
        icon={<Wallet />}
        ref={inputRef}
        color={"primary"}
      />
      <Input
        title={"outline color"}
        icon={<Wallet />}
        ref={inputRef}
        color={"outline"}
      />
      <p>Select</p>
      <Select value={value} setValue={setValue} options={options} />
    </>
  );
}
