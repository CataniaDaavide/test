import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const { ModeToggle } = require("@/components/mode-toggle");
const { Wallet } = require("lucide-react");

export function AuthLayout({ title, desciption, children }) {
  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center">
      <div className="absolute top-3 right-3">
        <ModeToggle />
      </div>
      <Card
        className={"w-full max-w-md p-3 bg-transparent border-0! shadow-none"}
      >
        <CardHeader
          className={"w-full flex flex-col items-center justify-center"}
        >
          <Logo />
          <CardTitle>{title}</CardTitle>
          <CardDescription className={"text-center"}>
            {desciption}
          </CardDescription>
        </CardHeader>
        <CardContent className={"flex flex-col gap-3"}>{children}</CardContent>
      </Card>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <p className="text-sm">Versione: 2.0.0</p>
      </div>
    </div>
  );
}
//componente del logo usato nelle card di autenticazione
function Logo() {
  return (
    <div className="bg-primary text-background w-14 h-14 rounded-full flex items-center justify-center">
      <Wallet className="w-7 h-7" />
    </div>
  );
}
