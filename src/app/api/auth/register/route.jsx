import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/app/core/mongodbFunctions";
import { usersModel } from "@/app/models/usersModel";
import { base_checkEmail } from "@/app/core/baseFunctions";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const { name, email, password } = await req.json();

    //controllo payload
    if (!name || name === "") {
      rtn.error = "name is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!email || email === "") {
      rtn.error = "email is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!base_checkEmail(email)) {
      rtn.error = "invalid email format";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!password || password === "") {
      rtn.error = "password is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }


    //connessione al database e recupero collezzione "users"
    await connectDB();

    //controllo che l'email non sia già stata utilizzata
    let emailExists = await usersModel.findOne({ email: email });
    if (emailExists) {
      rtn.error = "Email gia usata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //criptazione della password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creazione e inserimento utente sul database
    const user = await usersModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      createAt: new Date().toISOString(),
    });

    //Creazione session token e salvataggio nei cookies
    const sessionToken = jwt.sign(
      {
        _id: user._id,
        name: name,
        email: email,
        createAt: new Date().toISOString(),
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

    dataResponse.result = true;
    rtn.response = dataResponse;
    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    rtn.error = error.message.toString() + " on endpoint:/api/auth/register";
    rtn.response = "";
    console.log(rtn);
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
