"use client";

//hoocks - functions - lib

//icons

//components

export default function MainPage() {
  return (
    <main className="flex-1 h-full overflow-y-scroll scrollbar-hide p-0 flex flex-col gap-1">
      <div className="w-full h-[200px] flex-none bg-green-200" />
      <div className="w-full h-[200px] flex-none bg-red-200" />
      <div className="w-full h-[300px] flex-none bg-yellow-200" />
      <div className="w-full h-[400px] flex-none bg-yellow-200" />
      <div className="w-full h-10 flex-none bg-blue-200" />
    </main>
  );
}
