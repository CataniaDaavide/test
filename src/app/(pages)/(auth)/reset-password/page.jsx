"use client";

//hoocks - functions - lib
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchApi,
  formValidation,
} from "@/app/core/baseFunctions";

//icons
import { Lock } from "lucide-react";

//components
import { Button, ButtonBack } from "@/app/components/ui/button";
import AuthLayout from "../authLayout";
import Input from "@/app/components/ui/input";
import { useExceptionManager } from "@/app/context/ExceptionManagerContext";

export default function LoginPage() {
  const { base_exceptionManager } = useExceptionManager() 
  const router = useRouter();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const newPasswordRef = useRef();
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("");
  const [formValidationError, setFormValidationError] = useState({
    password: "",
    confirmPassword: "",
    newPassword: "",
  });
  const isFirstRender = useState(true)

  useEffect(() => {
    // Aggiorna dinamicamente il titolo della pagina
    document.title = `Reset password`;
  }, []);

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
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
        newPassword: {
          value: newPassword,
          validators: {
            notEmpty: { message: "Password obbligatoria" },
            callback: {
              callback: () => {
                const valid =
                  password !== newPassword;
                return {
                  valid,
                  message:
                    "La nuova password deve essere diversa dalla precedente",
                };
              },
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
  }, [password, confirmPassword, newPassword]);

  // click sul pulsante "accedi"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const hasError = formValidationInit();
      if (hasError) return;

      // chimata endpoint /api/auth/login
      const requestData = {
        password: password,
        confirmPassword: confirmPassword,
        newPassword: newPassword,
      };
      await fetchApi(
        "/api/auth/reset-password",
        "POST",
        requestData,
        async (res) => {
          const data = await res.json();

          if (!res.ok && data.error != "") {
            return setError(data.error);
          }

          router.push("/login");
        }
      );
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
        case "password":
          confirmPasswordRef.current.focus();
          break;

        case "confirmPassword":
          newPasswordRef.current.focus();
          break;

        case "newPassword":
          handleSubmit(e);
          break;

        default:
          break;
      }
    }
  };

  return (
    <AuthLayout
      title={"Reset password"}
      desciption={"Reimposta la tua password in modo sicuro per continuare"}
    >
      <ButtonBack className={"absolute top-3 left-3"} />
      <Input
        title={"Password"}
        name="password"
        type={"password"}
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        val={password}
        onChange={(e)=>setPassword(e.target.value)}
        errorMessage={formValidationError.password}
        onKeyUp={handleKeyUp}
        />
      <Input
        title={"Conferma password"}
        name="confirmPassword"
        type={"password"}
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        errorMessage={formValidationError.confirmPassword}
        onKeyUp={handleKeyUp}
        />
      <Input
        title={"Nuova password"}
        name="newPassword"
        type={"password"}
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        ref={newPasswordRef}
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
        errorMessage={formValidationError.newPassword}
        onKeyUp={handleKeyUp}
      />
      <Button onClick={handleSubmit} color={"primary"}>
        <span>Reset password</span>
      </Button>
      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
    </AuthLayout>
  );
}
