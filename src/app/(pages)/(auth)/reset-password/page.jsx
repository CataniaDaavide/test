"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "../auth-layout";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonBack } from "@/components/button-back";
import { useMessage } from "@/context/MessageContext";
import { useLoader } from "@/context/LoaderContext";
import { ApiClient } from "@/lib/api-client";
// import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const { setLoader } = useLoader();
  const { setMessage } = useMessage();
  // const params = useSearchParams();
  // const token = params.get("token");
  // const router = useRouter();

  const defaultFormValues = {
    // token: token,
    password: "",
    confirmPassword: "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const defaultFormErrors = Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [key, ""]),
  );
  const [formErrors, setFormErrors] = useState(defaultFormErrors);

  // FORM VALIDATOR
  const formValidator = {};

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
      const response = await api.post("/api/auth/reset-password", formValues);

      setMessage({
        title: "Password reimpostata",
        status: "success",
        description: "La password è stata reimpostata con successo.",
        // actions: [
        //   <Button variant="outline" onClick={() => router.push("/login")}>
        //     Vai al login
        //   </Button>,
        // ],
      });
    } catch (e) {
      console.log(e);
      setMessage({
        title: e.status === 429 ? "Limite raggiunto" : `Errore ${e.status}`,
        status: "error",
        description: e.error || "Si è verificato un errore.",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <AuthLayout
      title={"Crea una nuova password"}
      desciption={
        "Inserisci una nuova password sicura per accedere nuovamente al tuo account."
      }
    >
      <div className="absolute top-3 left-3">
        <ButtonBack className={"text-5xl"} />
      </div>
      <Input
        id="password"
        label="Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
        value={formValues.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={formErrors.password}
      />
      <Input
        id="confirmPassword"
        label="Conferma Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
        //action vuoto evita di mostrare l'azione default del input type="password"
        action={<></>}
        value={formValues.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        error={formErrors.confirmPassword}
      />
      <Button onClick={handleSubmit}>Reset password</Button>
    </AuthLayout>
  );
}
