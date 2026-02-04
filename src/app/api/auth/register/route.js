import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { userCollection } from "@/models/users";
import { base_checkEmail } from "@/lib/utils";

export async function POST(req) {
  const rtn = { success: false, data: "", error: "" };

  try {
    const { name, surname, email, password } = await req.json();

    // --- VALIDAZIONE INPUT ---
    if (!name || name.trim() === "") {
      rtn.error = "Name is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }
    if (!surname || surname.trim() === "") {
      rtn.error = "Surname is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }
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

    // --- CONTROLLO EMAIL DUPLICATA ---
    const emailExists = await users.findOne({ email });
    if (emailExists) {
      rtn.error = "Email already used";
      return new NextResponse(JSON.stringify(rtn), { status: 409 });
    }

    // --- HASH PASSWORD ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- CREAZIONE UTENTE ---
    const now = new Date().toISOString();
    await users.insertOne({
      username: email.split("@")[0],
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      password: hashedPassword,
      bio:"",
      bannerUrl: "",
      avatarUrl: "",
      isActive: true,
      createdAt: now,
      createdBy: "system",
      updatedAt: now,
      updatedBy: "system",
    });

    // --- RISPOSTA ---
    rtn.success = true;
    rtn.data = { message: "Utente creto con successo." };

    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    rtn.error = error.message + " on endpoint:/api/auth/register";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
