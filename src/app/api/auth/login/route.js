import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { userCollection } from "@/models/users";
import { base_checkEmail } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req) {
  const rtn = { success: false, data: "", error: "" };

  try {
    const { email, password } = await req.json();

    // --- VALIDAZIONE INPUT ---
    if (!email || email.trim() === "") {
      rtn.error = "Email is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    if (!base_checkEmail(email)) {
      rtn.error = "Invalid email format";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    if (!password || password.trim() === "") {
      rtn.error = "Password is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    // --- CONNESSIONE DB ---
    const client = await clientPromise;
    const db = client.db();
    const users = userCollection(db);

    // --- RECUPERO UTENTE ---
    const user = await users.findOne({ email: email.trim() });

    if (!user) {
      rtn.error = "Invalid credentials";
      return new NextResponse(JSON.stringify(rtn), { status: 401 });
    }

    // --- VERIFICA PASSWORD ---
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      rtn.error = "Invalid credentials";
      return new NextResponse(JSON.stringify(rtn), { status: 401 });
    }

    // --- CREAZIONE JWT ---
    const sessionToken = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        createdAt: user.createdAt,
      },
      process.env.SECRET_TOKEN
    );

    //salvataggio dei cookie di sessione
    const cookieStore = await cookies();
    cookieStore.set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60, // durata 1 ora
    });

    // --- RISPOSTA ---
    rtn.success = true;
    rtn.data = { message: "Login effettuato con successo." };

    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    rtn.error = error.message + " on endpoint:/api/auth/login";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
