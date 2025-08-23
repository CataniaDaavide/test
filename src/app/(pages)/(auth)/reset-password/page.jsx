"use client";

//hoocks - functions - lib
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  base_exceptionManager,
  fetchApi,
  formValidation,
} from "@/app/core/baseFunctions";

//icons
import { Lock } from "lucide-react";

//components
import InputPassword from "@/app/components/ui/input/input-password";
import { Button } from "@/app/components/ui/button/button";
import { ToggleTheme } from "@/app/components/ui/toggle-theme";
import AuthLayout from "../authLayout";

export default function LoginPage() {
  const router = useRouter();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const newPasswordRef = useRef();
  const [error, setError] = useState("");
  const [formValidationError, setFormValidationError] = useState({
    password: "",
    confirmPassword: "",
    newPassword: "",
  });

  // inizializzazione delle regole di validazione
  function formValidationInit() {
    try {
      const fields = {
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
        newPassword: {
          value: newPasswordRef.current.value,
          validators: {
            notEmpty: { message: "Password obbligatoria" },
            callback: {
              callback: () => {
                const valid =
                  passwordRef.current.value !== newPasswordRef.current.value;
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

  // click sul pulsante "accedi"
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const hasError = formValidationInit();
      if (hasError) return;

      // chimata endpoint /api/auth/login
      const requestData = {
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
        newPassword: newPasswordRef.current.value,
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
      <InputPassword
        title={"Password"}
        name="password"
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        ref={passwordRef}
        errorMessage={formValidationError.password}
        onKeyUp={handleKeyUp}
      />
      <InputPassword
        title={"Conferma password"}
        name="confirmPassword"
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        ref={confirmPasswordRef}
        errorMessage={formValidationError.confirmPassword}
        onKeyUp={handleKeyUp}
      />
      <InputPassword
        title={"Nuova password"}
        name="newPassword"
        icon={<Lock />}
        required={true}
        placeholder={"••••••"}
        ref={newPasswordRef}
        errorMessage={formValidationError.newPassword}
        onKeyUp={handleKeyUp}
      />
      <Button
        onClick={handleSubmit}
        title={"Reset password"}
        color={"primary"}
      />
      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
    </AuthLayout>
  );
}
