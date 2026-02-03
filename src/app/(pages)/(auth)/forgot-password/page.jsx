"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AtSign } from "lucide-react";
import { AuthLayout } from "../auth-layout";
import { Button } from "@/components/ui/button";
import { base_checkEmail, validateField } from "@/lib/utils";
import { useLoader } from "@/context/LoaderContext";
import { useMessage } from "@/context/MessageContext";
import { ApiClient } from "@/lib/api-client";
import { ButtonBack } from "@/components/button-back";

export default function ForgotPasswordPage() {
  const { setLoader } = useLoader();
  const { setMessage } = useMessage();
  const [disabled, setDisabled] = useState(false);

  const defaultFormValues = {
    email: "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const defaultFormErrors = Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [key, ""]),
  );
  const [formErrors, setFormErrors] = useState(defaultFormErrors);

  // FORM VALIDATOR
  const formValidator = {
    email: [
      {
        validate: (value) => value.trim() !== "",
        message: "Email obbligatoria",
      },
      {
        validate: (value) => base_checkEmail(value),
        message: "Email non valida",
      },
    ],
  };

  // HANDLER GENERICO
  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    const error = formValidator[field]
      ? validateField(field, value, formValidator)
      : "";

    setFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);

      let hasError = false;
      const newErrors = {};

      for (const field in formValues) {
        const errorFound = formValidator[field]
          ? validateField(field, formValues[field], formValidator, formValues)
          : "";
        newErrors[field] = errorFound;

        if (!hasError && errorFound) hasError = true;
      }

      setFormErrors(newErrors);

      if (hasError) return;

      const api = new ApiClient();
      //   const response = await api.post("/api/auth/reset-password", formValues);

      //disabilita il pulsante per richidere l'email
      setDisabled(true);

      setMessage({
        title: "Controlla la tua email",
        status: "success",
        description:
          "Ti abbiamo inviato le istruzioni per recuperare la password al tuo indirizzo email.",
      });
    } catch (e) {
      setMessage({
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
      title={"Recupera la tua password"}
      desciption={
        "Inserisci la tua email e ti invieremo un link per reimpostare la password in pochi minuti."
      }
    >
      <div className="absolute top-3 left-3">
        <ButtonBack className={"text-5xl"} />
      </div>
      <Input
        id="email"
        label="Email"
        required
        iconLeft={<AtSign />}
        placeholder={"Inserisci email"}
        value={formValues.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={formErrors.email}
      />
      <Button onClick={handleSubmit} disabled={disabled}>
        Invia istruzioni
      </Button>
    </AuthLayout>
  );
}
