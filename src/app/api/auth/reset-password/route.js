import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { userCollection } from "@/models/users";
import { passwordTokenCollection } from "@/models/passwordTokens";

export async function POST(req) {
  const rtn = { success: false, data: "", error: "" };

  try {
    const { token, password } = await req.json();
    console.log(token, password)

    // --- VALIDAZIONE INPUT ---
    if (!token || token.trim() === "") {
      rtn.error = "Token is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    if (!password || password.trim() === "") {
      rtn.error = "Password is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    // if (password.length < 8) {
    //   rtn.error = "Password must be at least 8 characters long";
    //   return new NextResponse(JSON.stringify(rtn), { status: 400 });
    // }

    // --- CONNESSIONE DB ---
    const client = await clientPromise;
    const db = client.db();
    const users = userCollection(db);
    const tokens = passwordTokenCollection(db);

    // --- VERIFICA TOKEN ---
    const record = await tokens.findOne({ token: token.trim() });

    if (!record) {
      rtn.error = "Invalid or expired token";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    if (record.used) {
      rtn.error = "Token already used";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      rtn.error = "Token expired";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    // --- HASH NUOVA PASSWORD ---
    const hashed = await bcrypt.hash(password, 10);

    // --- AGGIORNA PASSWORD ---
    await users.updateOne(
      { _id: record.userId },
      { $set: { password: hashed } }
    );

    // --- INVALIDA TOKEN (monouso) ---
    await tokens.updateOne(
      { _id: record._id },
      { $set: { used: true, usedAt: new Date() } }
    );

    // --- RISPOSTA ---
    rtn.success = true;
    rtn.data = { message: "Password updated successfully." };

    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    console.error("Error in /api/reset-password:", error);
    rtn.error = error.message + " on endpoint:/api/reset-password";
    rtn.data = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}