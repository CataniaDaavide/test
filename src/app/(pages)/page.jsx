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
import { useExceptionManager } from "../context/ExceptionManagerContext";
import { ModalContext } from "../context/ModalContext";

export default function App() {
  const tabs = [
    {
      value: "ExampleCard",
      tab: <ExampleCard />
    },
    {
      value: "CardSlider",
      tab: <CardSliderTest />,
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

function AllButtons() {
  const { base_exceptionManager } = useExceptionManager();
  const { modal, setModal } = useContext(ModalContext);
  const showErrorModal = () => {
    try {
      throw new Error(
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic aliquid laboriosam natus consequatur corporis at quaerat vero impedit quisquam illum doloribus, temporibus facilis officia ut dolores ipsum eaque perferendis id rerum similique et repellat nostrum. Libero earum ipsam sint quam assumenda nam ratione alias similique est, et ut cumque quibusdam ea enim? Officiis quas minima, consectetur rerum laboriosam numquam modi aliquid ut. Facilis deserunt eveniet suscipit tempore, unde sunt velit possimus aliquam obcaecati mollitia totam ipsa laudantium vitae officia quam veniam. Qui iste quia nobis modi perferendis amet. Aliquam aperiam laborum eum deleniti autem, ipsum, odit, dolorum fuga eligendi esse doloremque aspernatur earum! Cumque, repudiandae voluptate, vero corrupti fugiat molestias optio repellat, error voluptatibus animi vel fuga temporibus modi excepturi dolores accusamus inventore quod. Quae nostrum magnam voluptatibus harum consequuntur nemo provident laborum omnis sunt ratione libero ea culpa blanditiis illo mollitia possimus ab reprehenderit magni, hic impedit soluta eveniet. Porro quae odit sunt sit dicta error ipsam perspiciatis, veniam quidem facere, consequatur vitae amet facilis omnis laboriosam voluptate. Aliquam cupiditate provident impedit fugiat cumque, illo aut quasi ex, veritatis accusantium exercitationem iure ab quisquam qui optio dolores placeat suscipit adipisci? Recusandae hic earum expedita inventore eligendi, excepturi aliquid voluptate necessitatibus quos dicta illo accusantium placeat autem aperiam obcaecati nam maiores corporis quisquam impedit at ex maxime laudantium! Harum deleniti saepe repudiandae et consequatur provident cupiditate ipsa quos, praesentium aliquam ipsam sint sunt vero accusantium consectetur quas reprehenderit necessitatibus quae. Ab excepturi ullam nisi natus quod ipsam voluptas eos, id ea quidem, veritatis saepe, est placeat necessitatibus delectus aliquam culpa? Perferendis autem sunt corporis earum, suscipit repellendus quisquam enim quibusdam animi qui tenetur temporibus dicta! Commodi optio doloribus autem fugit corporis maxime assumenda officia natus? In repellendus adipisci nisi officia dolores! Corporis ullam odio unde quos impedit ea est voluptas, explicabo neque atque, inventore"
      );
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
          description: "Ciao come stai, io tutto bene"
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
    </>
  );
}
