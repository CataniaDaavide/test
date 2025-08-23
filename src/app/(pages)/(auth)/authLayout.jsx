//icons
import { Wallet } from "lucide-react";

//components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

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

function Logo() {
  return (
    <div className="mb-1 p-4 bg-background-inverse rounded-full text-white dark:text-black">
      <Wallet size={30} />
    </div>
  );
}
