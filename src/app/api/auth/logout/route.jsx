import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const cookieStore = await cookies()

    //controllo esistenza della sessione
    const hasSessionToken = cookieStore.has("sessionToken")
    if(!hasSessionToken){
      rtn.error = "Sessione non trovata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //eliminazione del cookie di sessione
    cookieStore.delete("sessionToken")

    dataResponse.result = true;
    rtn.response = dataResponse;
    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    rtn.error = error.message.toString() + " on endpoint:/api/auth/logout";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
