"use client"
import Link from "next/link";

export default  function Home() {

  const test = (e) => {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <p className="text-2xl font-bold">Home</p>
      <Link href={"/test"} className="underline">
        Test
      </Link>
    </div>
  );
}
