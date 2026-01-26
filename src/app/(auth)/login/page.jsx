"use client";
import { AuthLayout } from "@/app/(auth)/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoader } from "@/context/LoaderContext";
import { AtSign, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { setLoader } = useLoader();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      setLoader(true);

      // const api = new ApiClient();
      // const response = await api.get(
      //   "https://jsonplaceholder.typicode.com/users",
      //   3000,
      // );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/");
    } catch (e) {
      setError({
        title: `Errore ${e.status}`,
        status: "error",
        description: e.message || e.toString(),
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <AuthLayout
      title={"Benvenuto"}
      desciption={"Accedi al tuo account per gestire le tue finanze"}
    >
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
      {error && (
        <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      <Button onClick={handleLogin}>Accedi</Button>
      <Button variant="secondary">Credenziali demo</Button>
      <p className="text-sm text-muted-foreground self-center">
        Non hai un account?{" "}
        <Link href={"/register"} className="font-bold underline text-primary">
          Registrati
        </Link>
      </p>
    </AuthLayout>
  );
}
