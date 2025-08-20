"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { InputBase, InputPassword } from "@/app/components/ui/input/input";

export default function LoginPage() {
  const email = useRef();
  const [ password, setPassword ] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email.current.value, password)
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col gap-3 items-center justify-center">
        <p className="text-2xl font-bold">Login</p>
        <Link href={"/"} className="underline">
          Home
        </Link>

        <InputBase name="email" type="email" ref={email} />
        <InputPassword name="password" data={password} setData={setPassword} />
        <button onClick={handleSubmit} className="text-sm font-semibold border w-full rounded-sm">Click</button>
      </div>
    </div>
  );
}
