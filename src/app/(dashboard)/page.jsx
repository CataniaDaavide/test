import { FadeUp } from "@/components/fade-up";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="flex-1 min-h-0 w-full p-6" noscrollbar>
      <FadeUp className={"w-full flex flex-col gap-3"}>
        {Array.from({ length: 20 }).map((_, index) => {
          return <Card key={index} className={"w-full h-32"} />;
        })}
      </FadeUp>
    </ScrollArea>
  );
}
