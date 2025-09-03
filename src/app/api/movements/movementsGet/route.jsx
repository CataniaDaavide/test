import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { categoriesModel } from "@/app/models/categoriesModel";
import connectDB from "@/app/core/mongodbFunctions";
import { movementsModel } from "@/app/models/movementModel";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const { dateStart, dateEnd } = await req.json();
    const cookieStore = await cookies();

    //controllo esistenza della sessione
    const hasSessionToken = cookieStore.has("sessionToken");
    if (!hasSessionToken) {
      rtn.error = "Sessione non trovata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //recupero l'email dal token di sessione attuale e lo rimuovo
    var sessionToken = cookieStore.get("sessionToken")?.value;
    const { _id, email } = jwt.decode(sessionToken, process.env.SECRET_TOKEN);

    //connessione al database e recupero collezzione "users"
    await connectDB();

    // //recupero dei movimenti
    const filter = { userId: _id };
    if (dateStart || dateEnd) {
      filter.date = {};
      if (dateStart) {
        filter.date.$gte = new Date(dateStart);
      }
      if (dateEnd) {
        filter.date.$lte = new Date(dateEnd);
      }
    }
    const movements = await movementsModel.find(filter).sort({date: -1});

    // dataResponse.result = true;
    // rtn.response = dataResponse;
    return new NextResponse(JSON.stringify({ movements: movements }), {
      status: 200,
    });
  } catch (error) {
    rtn.error =
      error.message.toString() + " on endpoint:/api/categories/categoriesGet";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
