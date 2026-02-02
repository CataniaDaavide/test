import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="w-full h-full flex flex-col gap-5 px-6">
      {/* banner, avatar e actions*/}
      <div className="relative w-full">
        <div className="bg-zinc-800 w-full h-32 md:h-52 rounded-lg" />
        <div className="absolute -bottom-15 left-5 bg-zinc-800 rounded-full w-30 h-30 border-5 border-background"></div>
        {/* actions */}
        <div className="absolute right-0 -bottom-10">
          <Button
            variant="ghost"
            className={
              "text-muted-foreground! hover:bg-transparent! hover:text-primary!"
            }
          >
            <Pencil />
          </Button>
        </div>
      </div>
      <p className="mt-12 px-8">Nome utente</p>
      {/* <p className="text-2xl font-bold">ProfilePage</p> */}
    </div>
  );
}
