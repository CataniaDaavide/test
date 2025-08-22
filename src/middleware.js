import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  //lista di pagine private accessibili solo dopo aver fatto il login
  const routesPrivate = ["/test"]
  const cookieStore = await cookies()

  //controllo per capire se la pagina è privata
  const isPrivate = routesPrivate.includes(request.nextUrl.pathname)
  if (isPrivate) {

    //controllo per capire se l'utente è loggato (ha un token di sessione)
    const hasSessionToken = cookieStore.has("sessionToken")
    if(!hasSessionToken){
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}