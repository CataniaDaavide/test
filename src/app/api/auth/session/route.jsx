import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json()
    const { token } = payload
    
    const verify = jwt.verify(token, process.env.SECRET_TOKEN);
    if (verify) {
      return NextResponse.json({ message: "Token valido" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Token non valido" }, { status: 401 });
  }
}
