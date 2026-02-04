"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function CategoriesPage() {
  return (
    // <div className="w-full h-full flex items-center justify-center">
    // </div>
    <div className="flex-1 p-5 pt-0">
      <Tabs defaultValue="overview">
        <TabsList className={"border bg-card p-1 h-auto!"}>
          <TabsTrigger
            value="account"
            className={
              "data-[state=active]:bg-secondary border-0 rounded-lg shadow-none!"
            }
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className={
              "data-[state=active]:bg-secondary border-0 rounded-lg shadow-none!"
            }
          >
            Password
          </TabsTrigger>
        </TabsList>

        <Card className="w-full h-32" />
        
        <p className="text-2xl font-bold">CategoriesPage</p>

        <TabsContent value="account">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero qui,
          tempora soluta quidem vitae sit voluptate nemo est tenetur blanditiis
          eius perferendis amet veniam quam! Impedit repellat, aspernatur
          pariatur vitae, ea officiis nostrum vel sit illo odit nobis quos.
          Excepturi error voluptate, asperiores voluptas eos consequatur
          eligendi quaerat ab ducimus, dolore harum rem tempora. Adipisci,
          deserunt laudantium, eveniet sunt nihil quidem modi quos debitis
          cumque ut commodi maiores, voluptates animi iure ab neque. Quis ad
          dolor facere recusandae facilis maxime itaque vel, ab aspernatur
          architecto? Nam nostrum impedit soluta neque praesentium earum,
          voluptates dolores dicta unde duci
        </TabsContent>
        <TabsContent value="password">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis
          quisquam, corrupti nemo eos tempora, adipisci error recusandae
          deleniti iusto quia autem natu
        </TabsContent>
      </Tabs>
    </div>
  );
}

// riga di pulsanti azioni per la pagina deelle categorie
function Actions({ setShowFilter, setDialog }) {
  return (
    <div className={"w-full flex md:justify-end gap-3 px-5 mb-3"}>
      <Button variant="secondary" size="icon">
        <RefreshCcw />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <ListFilter />
      </Button>
      <Button
        variant="secondary"
        className="flex-1 md:max-w-52"
        onClick={() =>
          setDialog({
            show: true,
            type: "category",
            data: {},
          })
        }
      >
        <Plus /> Crea categoria
      </Button>
    </div>
  );
}
