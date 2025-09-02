"use client";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
// import { UserInfoTemp } from "@/app/components/temp/userinfo-temp";
import { fetchApi } from "@/app/core/baseFunctions";
import { UserIcon } from "lucide-react";
import { Button, ButtonLogout } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter()
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   setUser({
  //     name: "Davide Davide",
  //     email: "test@gmail.com",
  //     createAt: new Date().toISOString(),
  //   });
  // }, []);

  // if (user === null) return null;

  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center p-3">
      <p>Profile page</p>
      {/* <UserInfoTemp /> */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <Button onClick={() => router.push("/reset-password")}>Reset password</Button>
        <ButtonLogout />
      </div>
    </div>
  );
}
