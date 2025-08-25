//icons
import { Wallet } from "lucide-react";

//components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

//componente per il layout delle pagine di autenticazione 
//il layout è stato fatto usando un componente e non come pagina layout.jsx perchè le pagine si trovano dentro la route main
// es: dominio/login o dominio/register etc...
export default function AuthLayout({ title, desciption, children }) {
  return (
    <div className="w-full max-w-md p-3">
      <Card>
        <CardHeader>
          <Logo />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{desciption}</CardDescription>
        </CardHeader>
        {children}
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
