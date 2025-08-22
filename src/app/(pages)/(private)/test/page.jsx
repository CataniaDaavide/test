import Link from "next/link";

export default function Test(){
    return(
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col gap-1 items-center justify-center">
        <p className="text-2xl font-bold">Test - (PAGINA PRIVATA)</p>
        <Link href={"/"} className="underline">Home</Link>
      </div>
    </div>
    )
}