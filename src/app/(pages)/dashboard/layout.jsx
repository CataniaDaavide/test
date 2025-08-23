import { ButtonLogout } from "@/app/components/ui/button/ButtonLogout";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <LinkTemp />
      <UserInfoTemp />
      {children}
    </div>
  );
}

function LinkTemp() {
  return (
    <div className="flex gap-3">
      <Link href={"/dashboard"} className="underline">
        main
      </Link>
      <Link href={"/dashboard/categories"} className="underline">
        categories
      </Link>
      <Link href={"/dashboard/movements"} className="underline">
        movements
      </Link>
      <Link href={"/dashboard/accounts"} className="underline">
        accounts
      </Link>
      <Link href={"/dashboard/profile"} className="underline">
        profile
      </Link>
      <Link href={"/reset-password"} className="underline">
        reset-password
      </Link>
      <ButtonLogout />
    </div>
  );
}

import { cookies } from "next/headers";
import Link from "next/link";
import jwt from "jsonwebtoken";

async function UserInfoTemp() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  const { createAt, email, _id } = await jwt.decode(
    sessionToken,
    process.env.SECRET_TOKEN
  );

  return (
    <div className="max-w-md flex flex-col gap-3 items-center justify-center text-center break-all bg-card rounded-md border border-border-card p-5">
      <p className="text-blue-500">_id: <span className="text-blue-300">{_id}</span></p>
      <p className="text-blue-500">email:  <span className="text-blue-300">{email}</span></p>
      <p className="text-blue-500">createAt: <span className="text-blue-300">{createAt}</span></p>
      <p className="text-blue-500">sessionToken: <span className="text-blue-300">{sessionToken}</span></p>
    </div>
  );
}
