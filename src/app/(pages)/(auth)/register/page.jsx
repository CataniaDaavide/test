"use client";

//hoocks - functions - lib
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { base_checkEmail, fetchApi, formValidation } from "@/app/core/baseFunctions";

//icons
import { AtSign, Lock, User } from "lucide-react";

//components
import { Button } from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import AuthLayout from "../authLayout";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";

export default function RegisterPage() {
  const { base_exceptionManager } = useExceptionManager();
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [formValidationError, setFormValidationError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Aggiorna dinamicamente il titolo della pagina
    document.title = `Register`;
  }, []);

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
        name: {
          value: name,
          validators: {
            notEmpty: { message: "Nome obbligatorio" },
          },
        },
        email: {
          value: email,
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
          value: password,
          validators: {
            notEmpty: { message: "Password obbligatoria" },
          },
        },
        confirmPassword: {
          value: confirmPassword,
          validators: {
            notEmpty: { message: "Password obbligatoria" },
            match: {
              value: password,
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

  // evento che gestice gli errori della
  // form validator quando i campi vengono compilati
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Solo se ci sono già errori
    const hasExistingErrors = Object.values(formValidationError).some(
      (error) => error !== ""
    );
    if (hasExistingErrors) {
      formValidationInit();
    }
  }, [name, email, password, confirmPassword]);

  // click sul pulsante "crea account"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");

      const hasError = formValidationInit();
      if (hasError) return;

      // chimata endpoint /api/auth/register
      const requestData = {
        name: name,
        email: email.trim().toLowerCase(),
        password: password,
      };
      await fetchApi("/api/auth/register", "POST", requestData, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          return base_exceptionManager(data.error);
        }

        router.push("/dashboard");
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
    <AuthLayout
      title={"Crea account"}
      desciption={"Registrati per iniziare a gestire le tue finanze"}
    >
      <Input
        title={"Nome"}
        type="text"
        name="name"
        icon={<User />}
        required={true}
        placeholder={"Inserisci nome"}
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}
        errorMessage={formValidationError.email}
        onKeyUp={handleKeyUp}
        className="lowercase"
      />
      <Input
        title={"Password"}
        type="password"
        name="password"
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        ref={confirmPasswordRef}
        errorMessage={formValidationError.confirmPassword}
        onKeyUp={handleKeyUp}
      />
      <Button onClick={handleSubmit} color={"primary"}>
        <span>Crea account</span>
      </Button>
      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
      <p className="text-sm text-muted-foreground">
        Hai gia un account?
        <Link
          href={"/login"}
          className="ml-1 underline font-semibold text-black dark:text-white"
        >
          Accedi
        </Link>
      </p>
    </AuthLayout>
  );
}
