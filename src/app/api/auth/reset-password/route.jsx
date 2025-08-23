import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/app/core/mongodbFunctions";
import { usersModel } from "@/app/models/usersModel";
import { base_checkEmail } from "@/app/core/baseFunctions";
import { AwardIcon } from "lucide-react";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const { password, newPassword } = await req.json();

    //controllo payload
    if (!password || password === "") {
      rtn.error = "password is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!newPassword || newPassword === "") {
      rtn.error = "newPassword is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //controllo esistenza della sessione
    const cookieStore = await cookies()
    const hasSessionToken = cookieStore.has("sessionToken")
    if(!hasSessionToken){
      rtn.error = "Sessione non trovata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //recupero l'email dal token di sessione attuale e lo rimuovo
    var sessionToken = cookieStore.get("sessionToken")?.value
    const { email } = jwt.decode(sessionToken, process.env.SECRET_TOKEN)
    cookieStore.delete("sessionToken")

    //connessione al database e recupero collezzione "users"
    await connectDB();

    //ricerca dell'utente
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      rtn.error = "Utente non trovato";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //controllo che la password sia corretta
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      rtn.error = "Password errata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

   //criptazione della NUOVA password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //update dell'utente sul database
    await usersModel.findOneAndUpdate({ email: email }, {password: hashedNewPassword})

    dataResponse.result = true;
    rtn.response = dataResponse;
    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    rtn.error = error.message.toString() + " on endpoint:/api/auth/reset-password";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
