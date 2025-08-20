import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  const routesPrivate = ["/test"]
  const isPrivate = routesPrivate.includes(request.nextUrl.pathname)
  
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  
  const url = `${request.nextUrl.origin}/api/auth/verify-token`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({token}),
  };

  if (isPrivate) {
    const response = await fetch(url, options);
    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}