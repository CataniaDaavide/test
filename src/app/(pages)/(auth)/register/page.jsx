"use client";
import { Button } from "@/app/components/ui/input/button";
import { Input } from "@/app/components/ui/input/input";
import { base_exceptionManager, formValidate } from "@/app/core/baseFunctions";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function RegisterPage() {
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

  // click sul pulsante "crea account"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Definizione campi e validator
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
      const hasError = formValidate(setFormValidationError, fields);
      if (hasError) return;
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
    <div className="flex flex-col gap-3 items-center justify-center w-10/12 max-w-[450px] p-6 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800">
      <div className="p-4 bg-zinc-950 dark:bg-zinc-100 rounded-full text-white dark:text-black">
        <Wallet size={30}/>      
      </div>
      <div className="flex flex-col gap-1 items-center justify-center mb-3">
        <p className="text-2xl font-semibold">Crea account</p>
        <p className="text-sm text-zinc-400">
          Registrati per iniziare a gestire le tue finanze
        </p>
      </div>
      <Input
        title={"Nome"}
        type="text"
        name="name"
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
        required={true}
        placeholder={"••••••"}
        ref={confirmPasswordRef}
        errorMessage={formValidationError.confirmPassword}
        onKeyUp={handleKeyUp}
      />
      <Button onClick={handleSubmit} title={"Crea Account"} />
      <p className="text-sm text-zinc-400">
        Hai gia un account?
        <Link href={"/login"} className="ml-1 underline font-semibold text-black dark:text-white">
          Accedi
        </Link>
      </p>
    </div>
  );
}
