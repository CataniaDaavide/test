// "use client";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { UserInfoTemp } from "@/app/components/temp/userinfo-temp";
import { fetchApi } from "@/app/core/baseFunctions";
import { UserIcon } from "lucide-react";
// import { useEffect, useState } from "react";

export default function ProfilePage() {
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
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <p>Profile page</p>
      <UserInfoTemp />
    </div>
  );
}
