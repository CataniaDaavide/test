"use client";

import { useContext, useRef, useState } from "react";
import { LogIn, Plus, TriangleAlert } from "lucide-react";
import Input, { ExampleCheckboxComponent } from "../components/ui/input";
import { Button, ButtonIcon } from "../components/ui/button";
import { Card, ExampleCard } from "../components/ui/card";
import Select, { ExampleMultiSelectComponent, ExampleSelectComponent } from "../components/ui/select";
import Tabs, { ExampleTabsComponents } from "../components/ui/tabs";
import ButtonToggleTheme from "../components/ui/toggle-theme";
import { useExceptionManager } from "../context/ExceptionManagerContext";
import { ModalContext } from "../context/ModalContext";
import Badge from "../components/ui/badge";
import EmojiPicker from "../components/ui/emoji-picker";
import ColorPicker from "../components/ui/color-picker";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
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
      <ButtonIcon
        onClick={() => router.push("/login")}
        icon={<LogIn />}
        className="absolute top-3 left-3 !rounded-full"
        color={"trasparent"}
      />
      <ButtonToggleTheme className={"absolute top-3 right-3 !rounded-full"} color={"trasparent"} />
      <div className="text-center">
        <p className="text-2xl font-bold">App page</p>
        <p className="text-muted-foreground text-sm">Uso questa pagina come test per i componenti</p>
      </div>
      <Tabs tabs={tabs} value={tabValue} setValue={setTabValue} />

      {tabValue === 1 && <ExampleCard />}
      {tabValue === 2 && <AllButtons />}
      {tabValue === 3 && <ExampleCheckboxComponent />}
      {tabValue === 4 && (
        <div className="w-full flex flex-col gap-3">
          <ExampleMultiSelectComponent />
        </div>
      )}
      {tabValue === 5 && <TestComponents />}
    </div>
  );
}
//<ExampleSelectComponent />

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
          icon: <TriangleAlert size={40} className="text-amber-600" />,
          message: (
            <p className="text-muted-foreground">
              Sei sicuro di voler eliminare la categoria {"emoji"} - {"name"}?
              <br />
              <br />
              Cliccando su <strong className="text-background-inverse">Elimina</strong>, la categoria verrà rimossa
              dall’elenco e non sarà più modificabile.
              <br />
              <br />
              Le transazioni già assegnate a questa categoria resteranno invariate e continueranno a mostrarla
              normalmente.
            </p>
          ),
          buttons: ["close"],
        },
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  const showTransictionModalNew = () => {
    setModal({
      show: true,
      type: "movement",
      data: {},
    });
  };

  const showTransictionModalEdit = () => {
    setModal({
      show: true,
      type: "movement",
      data: {
        _id: "1234567890",
        date: "2025-12-01T14:54:00.000Z",
        createAt: "2025-12-01T14:54:00.000Z",
        categorieId: "68b38561f67de76b78729cb7",
        accountOneId: "68b5b079208f92fc4e27e4a3",
        amountOne: 1.2,
        accountTwoId: "555",
        amountTwo: 1.2,
        description: "Ciao come stai, io tutto bene",
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
      <Button onClick={showTransictionModalNew} color={"success"}>
        <Plus />
        <span>showTransictionModal new</span>
      </Button>
      <Button onClick={showTransictionModalEdit} color={"success"}>
        <Plus />
        <span>showTransictionModal edit</span>
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
