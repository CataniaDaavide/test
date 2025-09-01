"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Plus, TriangleAlert } from "lucide-react";
import Input, { ExampleCheckboxComponent } from "../components/ui/input";
import { Button, ButtonIcon } from "../components/ui/button";
import { Card, ExampleCard } from "../components/ui/card";
import Select, { ExampleSelectComponent } from "../components/ui/select";
import Tabs, { ExampleTabsComponents } from "../components/ui/tabs";
import ButtonToggleTheme from "../components/ui/toggle-theme";
import { useExceptionManager } from "../context/ExceptionManagerContext";
import { ModalContext } from "../context/ModalContext";
import Badge from "../components/ui/badge";
import EmojiPicker from "../components/ui/emoji-picker";
import ColorPicker from "../components/ui/color-picker";

export default function App() {
  const [tabValue, setTabValue] = useState(1);
  const tabs = [
    {
      label: "ExampleCard",
      value: 1,
    },
    {
      label: "buttons",
      value: 2,
    },
    {
      label: "checkbox",
      value: 3,
    },
    {
      label: "select",
      value: 4,
    },
    {
      label: "altri",
      value: 5,
    },
  ];

  const checkRef = useRef();

  return (
    <div className="w-full h-full max-w-md p-3 pt-5 flex flex-col gap-3 items-center">
      <ButtonToggleTheme
        className={"absolute top-3 right-3 !rounded-full"}
        color={"trasparent"}
      />
      <div className="text-center">
        <p className="text-2xl font-bold">App page</p>
        <p className="text-muted-foreground text-sm">
          Uso questa pagina come test per i componenti
        </p>
      </div>
      <Tabs tabs={tabs} value={tabValue} setValue={setTabValue} />

      {tabValue === 1 && <ExampleCard />}
      {tabValue === 2 && <AllButtons />}
      {tabValue === 3 && <ExampleCheckboxComponent />}
      {tabValue === 4 && <ExampleSelectComponent />}
      {tabValue === 5 && <TestComponents />}
    </div>
  );
}

function AllButtons() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const showErrorModal = () => {
    try {
      setModal({
        show: true,
        type: "alert",
        data: {
          title: "Errore",
          icon:<TriangleAlert size={40} className="text-amber-600" />,
          message: (
            <p className="text-muted-foreground">
              Sei sicuro di voler eliminare la categoria {"emoji"} - {"name"}?
              <br />
              <br />
              Cliccando su <strong className="text-background-inverse">Elimina</strong>, la categoria verrà rimossa
              dall’elenco e non sarà più modificabile.
              <br />
              <br />
              Le transazioni già assegnate a questa categoria resteranno
              invariate e continueranno a mostrarla normalmente.
            </p>
          ),
          buttons:["close", <Button onClick={() => console.log("danger")} color={"danger"}>danger</Button>]
        },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const showTransictionModal = () => {
    setModal({
      show: true,
      type: "transiction",
      data: {
        movementData: {
          _id: "aaaaaaaaaaaa",
          date: "2025-12-01T14:54:00.000Z",
          createAt: "2025-12-01T14:54:00.000Z",
          categorieId: "222",
          accountOneId: "666",
          amountOne: 1.2,
          accountTwoId: "555",
          amountTwo: 1.2,
          description: "Ciao come stai, io tutto bene",
        },
      },
    });
  };

  return (
    <>
      <p>all buttons</p>
      <Button>
        <Plus />
        <span>ciao</span>
      </Button>
      <Button color={"primary"}>
        <Plus />
        <span>ciao</span>
      </Button>
      <Button onClick={showTransictionModal} color={"success"}>
        <Plus />
        <span>showTransictionModal</span>
      </Button>
      <Button onClick={showErrorModal} color={"danger"}>
        <Plus />
        <span>showErrorModal</span>
      </Button>
      <Button color={"outline"}>
        <Plus />
        <span>ciao</span>
      </Button>
      <div className="w-full flex gap-3 items-center justify-center">
        <ButtonIcon icon={<Plus />} color={""} />
        <ButtonIcon icon={<Plus />} color={"outline"} />
        <ButtonIcon icon={<Plus />} color={"trasparent"} />
        <ButtonIcon icon={<Plus />} color={"success"} />
        <ButtonIcon icon={<Plus />} color={"danger"} />
      </div>
    </>
  );
}

function TestComponents() {
  const [emoji, setEmoji] = useState();
  const [color, setColor] = useState();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <Badge>ciao</Badge>
      <ExampleTabsComponents />
      <EmojiPicker value={emoji} setValue={setEmoji} />
      <ColorPicker value={color} setValue={setColor} />
    </div>
  );
}
