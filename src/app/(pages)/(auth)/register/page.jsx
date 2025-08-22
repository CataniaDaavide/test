"use client";

//hoocks - functions - lib
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  base_exceptionManager,
  fetchApi,
  formValidation,
} from "@/app/core/baseFunctions";

//icons
import { AtSign, Lock, User, Wallet } from "lucide-react";

//components
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { ToggleTheme } from "@/app/components/ui/toggle-theme";

export default function RegisterPage() {
  const router = useRouter();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [formValidationError, setFormValidationError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
        name: {
          value: nameRef.current.value,
          validators: {
            notEmpty: { message: "Nome obbligatorio" },
          },
        },
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
        confirmPassword: {
          value: confirmPasswordRef.current.value,
          validators: {
            notEmpty: { message: "Password obbligatoria" },
            match: {
              value: passwordRef.current.value,
              message: "Le password non coincidono",
            },
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

  // click sul pulsante "crea account"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const hasError = formValidationInit();
      if (hasError) return;

      // chimata endpoint /api/auth/register
      const requestData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      await fetchApi("/api/auth/register", "POST", requestData, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          return base_exceptionManager(data.error);
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
        case "name":
          emailRef.current.focus();
          break;

        case "email":
          passwordRef.current.focus();
          break;

        case "password":
          confirmPasswordRef.current.focus();
          break;

        case "confirmPassword":
          handleSubmit(e);
          break;

        default:
          break;
      }
    }
  };

  return (
    <div className="w-full max-w-md p-3">
      <ToggleTheme className={"absolute top-3 right-3"} />
      <Card>
        <CardHeader>
          <div className="mb-1 p-4 bg-background-inverse rounded-full text-white dark:text-black">
            <Wallet size={30} />
          </div>
          <CardTitle>Crea account</CardTitle>
          <CardDescription>
            Registrati per iniziare a gestire le tue finanz
          </CardDescription>
        </CardHeader>
          <Input
            title={"Nome"}
            type="text"
            name="name"
            icon={<User />}
            required={true}
            placeholder={"Inserisci nome"}
            ref={nameRef}
            errorMessage={formValidationError.name}
            onKeyUp={handleKeyUp}
          />
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
          <Input
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
          <Input
            title={"Conferma Password"}
            type="password"
            name="confirmPassword"
            icon={<Lock />}
            required={true}
            placeholder={"••••••"}
            ref={confirmPasswordRef}
            errorMessage={formValidationError.confirmPassword}
            onKeyUp={handleKeyUp}
          />
        <Button onClick={handleSubmit} title={"Crea account"} color={"primary"} />
        <p className="text-sm text-muted-foreground">
          Hai gia un account?
          <Link
            href={"/login"}
            className="ml-1 underline font-semibold text-black dark:text-white"
          >
            Accedi
          </Link>
        </p>
      </Card>
    </div>
  );
}
