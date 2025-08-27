"use client";

import { Card } from "@/app/components/ui/card";

//hoocks - functions - lib

//icons

//components

export default function MainPage() {
  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      <StatsContainer />
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-3">
        <RecentMovementsContainer />
        <OtherStastsContainer />
      </div> 
    </div>
  );
}

function StatsContainer() {
  return (
    <div className="gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      <FakeCard type="STATS" />
      <FakeCard type="STATS" />
      <FakeCard type="STATS" />
      <FakeCard type="STATS" />
    </div>
  );
}

function RecentMovementsContainer(){
  return(
    <div className={"h-full grid gap-3 col-span-2"}>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
      <FakeCard type="RECENT MOVEMENT"/>
    </div>
  )
}

function OtherStastsContainer(){
  return(
    <div className="w-full flex flex-col gap-3">
      <FakeCard type="OTHER STATS" />
      <FakeCard type="OTHER STATS" />
      <FakeCard type="OTHER STATS" />
      <FakeCard type="OTHER STATS" />
    </div>
  )
}

function FakeCard({ type = "" }) {
  return (
    <div className="w-full h-30 bg-card border border-border-card rounded-lg text-muted-foreground flex items-center justify-center">
      FakeCard - {type}
    </div>
  );
}
