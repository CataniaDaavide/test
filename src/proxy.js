import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request) {
  const token = request.cookies.get("sessionToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Se non c'è token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verifica JWT
    jwt.verify(token, process.env.SECRET_TOKEN);

    // Token valido → lascia passare
    return NextResponse.next();
  } catch (err) {
    // Token non valido → cancella cookie + redirect

    const res = NextResponse.redirect(new URL("/login", request.url));

    res.cookies.set("sessionToken", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return res;
  }
}

export const config = {
  matcher: [
    "/",
    "/categories",
    "/movements",
    "/accounts",
    "/profile",
  ],
};
