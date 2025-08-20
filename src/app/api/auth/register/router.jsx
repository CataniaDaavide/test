import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();
    const { name, email, password } = payload;

    //Connessione al database e recupero collezzione "users"
    await connectDb();
    const userCol = await db.collection("users");

    //controllo che l'email non sia già stata utilizzata
    let emailExists = await userCol.findOne({ email: email });
    if (emailExists) {
      return new NextResponse(JSON.stringify({ message: "Email gia usata" }), {
        status: 500,
      });
    }

    //criptazione della password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creazione e inserimento utente sul database
    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
      createAt: new Date().toISOString(),
    };
    const user = await userCol.insertOne(userData);
    const { _id } = user.toObject();

    //Creazione session token e salvataggio nei cookies
    const token = jwt.sign({
      _id: _id,
      name: name,
      email: email,
      createAt: createaAt,
    }, process.env.SECRET_TOKEN)

    const cookieStore = await cookies();
    cookieStore.set(name, token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60, // durata 1 ora
    });

    return new NextResponse(
      JSON.stringify({ message: "Utente creato"}),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Errore api:auth/register" },
      { status: 500 }
    );
  }
}
