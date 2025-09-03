"use client";

//hoocks - functions - lib
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  base_checkEmail,
  fetchApi,
  formValidation,
} from "@/app/core/baseFunctions";

//icons
import { AtSign, Lock } from "lucide-react";

//components
import AuthLayout from "../authLayout";
import Input from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";

export default function LoginPage() {
  const { base_exceptionManager } = useExceptionManager();
  const router = useRouter();
  const passwordRef = useRef(); // serve per gestire handleKeyUp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formValidationError, setFormValidationError] = useState({
    email: "",
    password: "",
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Aggiorna dinamicamente il titolo della pagina
    document.title = `Login`;
  }, []);

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
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
  }, [email, password]);

  // click sul pulsante "accedi"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      const hasError = formValidationInit();
      if (hasError) return exit();

      // chimata endpoint /api/auth/login
      const requestData = {
        email: email,
        password: password,
      };
      await fetchApi("/api/auth/login", "POST", requestData, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          setError(data.error);
          return exit();
        }

        exit();
        router.push("/dashboard");
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  // funzione che rimuove il loader in caso di errori o uscita
  const exit = () => {
    setIsLoading(false);
  };

  // click del pulsante "invio" ("Enter") passa al campo / azione successiva
  const handleKeyUp = (e) => {
    const { key, target } = e;
    const { name } = target;
    if (key.toString().trim().toUpperCase() === "ENTER") {
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
      setEmail("test@gmail.com");
      setPassword("123");
    } catch (error) {
      base_exceptionManager(error);
    }
  };

  return (
    <AuthLayout
      title={"Benvenuto"}
      desciption={"Accedi al tuo account per gestire le tue finanze"}
    >
      <Input
        title={"Email"}
        type="email"
        name="email"
        icon={<AtSign />}
        required={true}
        placeholder={"Inserisci email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        errorMessage={formValidationError.password}
        onKeyUp={handleKeyUp}
      />
      <Button onClick={handleSubmit} color={"primary"} isLoading={isLoading}>
        <span>Accedi</span>
      </Button>
      <Button onClick={handleDemoCredetial} color={"secondary"}>
        <span>Credenziali demo</span>
      </Button>
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
    </AuthLayout>
  );
}
