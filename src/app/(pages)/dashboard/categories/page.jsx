"use client";
import { ButtonIcon } from "@/app/components/ui/button/buttonIcon";
import Tabs from "@/app/components/ui/tabs";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button/button";
import { base_exceptionManager } from "@/app/core/baseFunctions";

export default function CategoriesPage() {
  const tabs = [
    {
      value: "entrate",
      tab: <p>entrate tab</p>,
    },
    {
      value: "uscite",
      tab: <p>uscite tab</p>,
    },
  ];
  const [value, setValue] = useState(tabs[0]);

  const handleNewCatecorie = (e) => {
    try {
        //TODO:        
    } catch (error) {
        base_exceptionManager(error)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <Tabs tabs={tabs} value={value.value} setValue={setValue} />
        <div className="flex gap-3">
        <ButtonIcon icon={<RefreshCcw />} />
        <Button title={"Nuova categoria"} onClick={handleNewCatecorie}/>
        </div>
      </div>
      {value.tab}
    </div>
  );
}


function CategorieContainer(){
    return(
        <div className="w-full flex gap-3">
            adad
        </div>
    )
}
