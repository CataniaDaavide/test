"use client"
import { AtSign, Lock, UserRound } from "lucide-react";
import { AuthLayout } from "../auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegiterPage() {
  return (
    <AuthLayout
      title={"Crea account"}
      desciption={"Registrati per iniziare a gestire le tue finanze"}
    >
      <Input
        id="name"
        label="Name"
        type="text"
        iconLeft={<UserRound />}
        required
        placeholder={"Inserisci nome"}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        iconLeft={<AtSign />}
        required
        placeholder={"Inserisci email"}
        className="lowercase"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
      />
      <Input
        id="confirmPassword"
        label="Conferma Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
      />
      <Button>Crea account</Button>
      <p className="text-sm text-muted-foreground self-center">
        Hai già un account?
        <Link href={"/login"} className="font-bold underline text-primary">
          Accedi
        </Link>
      </p>
    </AuthLayout>
  );
}
