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

export default function LoginPage() {
  const { setMessage } = useMessage();
  const { setLoader } = useLoader();
  const router = useRouter();

  const defaultFormValues = {
    email: "",
    password: "",
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
    password: [
      {
        validate: (value) => value.trim() !== "",
        message: "Password obbligatoria",
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
      const response = await api.post("/api/auth/login", formValues);

      router.push("/");
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
      title={"Benvenuto"}
      desciption={"Accedi al tuo account per gestire le tue finanze"}
    >
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
      <Button onClick={handleSubmit}>Accedi</Button>
      <p className="text-sm text-muted-foreground self-center flex gap-1">
        Non hai un account?
        <Link href={"/register"} className="font-bold underline text-primary">
          Registrati
        </Link>
      </p>
    </AuthLayout>
  );
}
