"use client";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "../auth-layout";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonBack } from "@/components/button-back";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title={"Reset password"}
      desciption={"Reimposta la tua password in modo sicuro per continuare"}
    >
      <div className="absolute top-3 left-3">
        <ButtonBack className={"text-5xl"}/>
      </div>
      <Input
        id="password"
        label="Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
      />
      <Input
        id="confirmPassword"
        label="Conferma Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
      />
      <Input
        id="newPassword"
        label="Nuova Password"
        type="password"
        iconLeft={<Lock />}
        required
        placeholder={"•••••••"}
      />
      <Button>Reset password</Button>
    </AuthLayout>
  );
}