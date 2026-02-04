import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { userCollection } from "@/models/users";
import { cookies } from "next/headers";

export async function GET(req) {
  const rtn = { success: false, data: "", error: "" };

  try {
    // --- PRENDI COOKIE SESSIONE ---
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
      rtn.error = "No session token";
      return new NextResponse(JSON.stringify(rtn), { status: 401 });
    }

    // --- VERIFICA JWT ---
    let decoded;
    try {
      decoded = jwt.verify(sessionToken, process.env.SECRET_TOKEN);
    } catch (err) {
      rtn.error = "Invalid session token";
      return new NextResponse(JSON.stringify(rtn), { status: 401 });
    }

    // --- CONNESSIONE DB ---
    const client = await clientPromise;
    const db = client.db();
    const users = userCollection(db);

    // --- TROVA UTENTE ---
    const user = await users.findOne({ email: decoded.email });
    if (!user) {
      rtn.error = "User not found";
      return new NextResponse(JSON.stringify(rtn), { status: 404 });
    }

    // --- RISPOSTA ---
    rtn.success = true;
    rtn.data = {
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        bio: "",
        bannerUrl: user.avatarUrl ?? "",
        avatarUrl: user.avatarUrl ?? "",
        createdAt: user.createdAt
      },
    };

    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    rtn.error = error.message;
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
