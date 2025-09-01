import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { categoriesModel } from "@/app/models/categoriesModel";
import connectDB from "@/app/core/mongodbFunctions";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const { type } = await req.json();
    const cookieStore = await cookies();

    // //controllo esistenza della sessione
    const hasSessionToken = cookieStore.has("sessionToken");
    if (!hasSessionToken) {
      rtn.error = "Sessione non trovata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    // //recupero l'email dal token di sessione attuale e lo rimuovo
    var sessionToken = cookieStore.get("sessionToken")?.value;
    const { _id, email } = jwt.decode(sessionToken, process.env.SECRET_TOKEN);

    //connessione al database e recupero collezzione "users"
    await connectDB();

    //recupero delle categorie
    const filter = { userId: _id };
    if (type && type != "ALL") {
      filter.type = type;
    }
    const categories = await categoriesModel.find(filter);

    // dataResponse.result = true;
    // rtn.response = dataResponse;
    return new NextResponse(JSON.stringify({ categories: categories }), {
      status: 200,
    });
  } catch (error) {
    rtn.error =
      error.message.toString() + " on endpoint:/api/categories/getCategories";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
