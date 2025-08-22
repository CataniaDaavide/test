"use client";

//hoocks - functions - lib
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  base_checkEmail,
  base_exceptionManager,
  fetchApi,
  formValidation,
} from "@/app/core/baseFunctions";

//icons
import { Wallet, AtSign, Lock } from "lucide-react";

//components
import { Input, InputPassword } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ToggleTheme } from "@/app/components/ui/toggle-theme";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [formValidationError, setFormValidationError] = useState({
    email: "",
    password: "",
  });

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
        email: {
          value: emailRef.current.value,
          validators: {
            notEmpty: { message: "Email obbligatoria" },
            callback: {
              message: "Email non valida",
              callback: (value) => {
                const ris = base_checkEmail(value);
                return {
                  valid: ris,
                  message: "Email non valida",
                };
              },
            },
          },
        },
        password: {
          value: passwordRef.current.value,
          validators: {
            notEmpty: { message: "Password obbligatoria" },
          },
        },
      };

      // Esegui validazione
      const hasError = formValidation(setFormValidationError, fields);
      return hasError;
    } catch (error) {
      base_exceptionManager(error);
    }
  }

  // click sul pulsante "accedi"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const hasError = formValidationInit();
      if (hasError) return;

      // chimata endpoint /api/auth/login
      const requestData = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      await fetchApi("/api/auth/login", "POST", requestData, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          return setError(data.error);
        }

        router.push("/");
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // click del pulsante "invio" ("Enter") passa al campo / azione successiva
  const handleKeyUp = (e) => {
    const { key, target } = e;
    const { name } = target;
    if (key.toString().trim().toUpperCase() === "ENTER") {
      console.log(name);

      switch (name) {
        case "email":
          passwordRef.current.focus();
          break;

        case "password":
          handleSubmit(e);
          break;

        default:
          break;
      }
    }
  };

  //click del pulsante "credenziali demo"
  const handleDemoCredetial = (e) => {
    try {
      e.preventDefault();
      emailRef.current.value = "test@gmail.com";
      passwordRef.current.value = "123";
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <div className="w-full max-w-md p-3">
      <ToggleTheme className={"absolute top-3 right-3"}/>
      <Card>
        <CardHeader>
        <div className="mb-1 p-4 bg-background-inverse rounded-full text-white dark:text-black">
          <Wallet size={30} />
        </div>
          <CardTitle>Benvenuto</CardTitle>
          <CardDescription>
            Accedi al tuo account per gestire le tue finanze
          </CardDescription>
        </CardHeader>
        <Input
          title={"Email"}
          type="email"
          name="email"
          icon={<AtSign />}
          required={true}
          placeholder={"Inserisci email"}
          ref={emailRef}
          errorMessage={formValidationError.email}
          onKeyUp={handleKeyUp}
        />
        <InputPassword
          title={"Password"}
          type="password"
          name="password"
          icon={<Lock />}
          required={true}
          placeholder={"••••••"}
          ref={passwordRef}
          errorMessage={formValidationError.password}
          onKeyUp={handleKeyUp}
        />
        <Button onClick={handleSubmit} title={"Accedi"} color={"primary"}/>
        <Button onClick={handleDemoCredetial} title={"Credenziali demo"} color={"secondary"} />
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        <p className="text-sm text-muted-foreground">
          Non hai un account?
          <Link
            href={"/register"}
            className="ml-1 underline font-semibold text-black dark:text-white"
          >
            Registrati
          </Link>
        </p>
      </Card>
    </div>
  );
}
