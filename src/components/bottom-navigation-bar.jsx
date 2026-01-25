import { ArrowUpDown, CreditCard, Folder, House, Plus } from "lucide-react";

export function BottomNavigationBar() {
  return (
    <div className="min-h-[100px] w-full  flex md:hidden items-center justify-evenly border-t">
      <House/>
      <Folder/>
      <div className="bg-zinc-800 p-3 rounded-full">
        <Plus/>
        </div>
      <ArrowUpDown/>
      <CreditCard/>
    </div>
  );
}
