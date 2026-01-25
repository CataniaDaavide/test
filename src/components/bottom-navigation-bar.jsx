import { ArrowUpDown, CreditCard, Folder, House, Plus } from "lucide-react";
import Link from "next/link";

export function BottomNavigationBar() {
  return (
    <div className="min-h-[100px] w-full  flex md:hidden items-center justify-evenly border-t">
      <Link href={"/"}>
        <House />
      </Link>
      <Folder />
      <Link href={"/test"}>
        <div className="bg-zinc-800 p-3 rounded-full">
          <Plus />
        </div>
      </Link>
      <ArrowUpDown />
      <CreditCard />
    </div>
  );
}
