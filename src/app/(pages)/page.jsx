import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <p className="text-2xl font-bold">Home</p>
      <Link href={"/test"} className="underline">
        Test
      </Link>
    </div>
  );
}
