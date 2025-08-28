//icons
import { Wallet } from "lucide-react";

//components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardTitle,
} from "@/app/components/ui/card";
import ButtonToggleTheme from "@/app/components/ui/toggle-theme";

//componente per il layout delle pagine di autenticazione
//il layout è stato fatto usando un componente e non come pagina layout.jsx perchè le pagine si trovano dentro la route main
// es: dominio/login o dominio/register etc...
export default function AuthLayout({ title, desciption, children }) {
  return (
    <div className="w-full max-w-md p-3">
      <ButtonToggleTheme
        className={"absolute top-3 right-3 !rounded-full"}
        color={"trasparent"}
      />
      <Card>
        <CardHeader>
          <CardHeaderContent
            className={"!w-full !items-center !justify-center"}
          >
            <Logo />
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desciption}</CardDescription>
          </CardHeaderContent>
        </CardHeader>
        <CardContent className={"flex flex-col gap-3 items-center"}>{children}</CardContent>
      </Card>
    </div>
  );
}

//componente del logo usato nelle card di autenticazione
function Logo() {
  return (
    <div className="mb-1 p-4 bg-background-inverse rounded-full text-white dark:text-black">
      <Wallet size={30} />
    </div>
  );
}
