"use client";
import { AtSign, Lock, UserRound } from "lucide-react";
import { AuthLayout } from "../auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { base_checkEmail, validateField } from "@/lib/utils";
import { useMessage } from "@/context/MessageContext";
import { ApiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

export default function RegiterPage() {
  const { setMessage } = useMessage();
  const { setLoader } = useLoader();
  const router = useRouter();

  const defaultFormValues = {
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const defaultFormErrors = Object.fromEntries(
    Object.keys(defaultFormValues).map((key) => [key, ""]),
  );
  const [formErrors, setFormErrors] = useState(defaultFormErrors);

  // FORM VALIDATOR
  const formValidator = {
    name: [
      {
        validate: (value) => value.trim() !== "",
        message: "Nome obbligatorio",
      },
    ],
    surname: [
      {
        validate: (value) => value.trim() !== "",
        message: "Cognome obbligatorio",
      },
    ],
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
    password: [
      {
        validate: (value) => value.trim() !== "",
        message: "Password obbligatoria",
      },
    ],
    confirmPassword: [
      {
        validate: (value) => value.trim() === formValues.password?.trim(),
        message: "Le password non coincidono",
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
      const response = await api.post("/api/auth/register", formValues);

      setMessage({
        title: "Registrazione completata",
        status: "success",
        description: "Il tuo account è pronto",
        actions: [
          <Button variant="outline" onClick={() => router.push("/login")}>
            Vai al login
          </Button>,
        ],
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
      title={"Crea account"}
      desciption={"Registrati per iniziare a gestire le tue finanze"}
    >
      <Input
        id="name"
        label="Nome"
        type="text"
        iconLeft={<UserRound />}
        required
        placeholder={"Inserisci nome"}
        onChange={(e) => handleChange("name", e.target.value)}
        error={formErrors.name}
      />

      <Input
        id="surname"
        label="Cognome"
        type="text"
        iconLeft={<UserRound />}
        required
        placeholder={"Inserisci cognome"}
        onChange={(e) => handleChange("surname", e.target.value)}
        error={formErrors.surname}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        iconLeft={<AtSign />}
        required
        placeholder={"Inserisci email"}
        className="lowercase"
        onChange={(e) => handleChange("email", e.target.value)}
        error={formErrors.email}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
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
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        error={formErrors.confirmPassword}
      />
      <Button onClick={handleSubmit}>Crea account</Button>
      <p className="text-sm text-muted-foreground self-center flex gap-1">
        Hai già un account?
        <Link href={"/login"} className="font-bold underline text-primary">
          Accedi
        </Link>
      </p>
    </AuthLayout>
  );
}
