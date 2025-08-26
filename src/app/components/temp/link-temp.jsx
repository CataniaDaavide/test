export function LinkTemp() {
  return (
    <div className="w-full max-w-md flex gap-3  flex-wrap items-center justify-center">
      <Link href={"/"} className="underline">
        test
      </Link>
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

