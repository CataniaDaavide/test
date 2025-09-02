import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { categoriesModel } from "@/app/models/categoriesModel";
import connectDB from "@/app/core/mongodbFunctions";
import { Currency } from "lucide-react";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const {
      _id: categorieId,
      name,
      emoji,
      hexColor,
      status,
      type,
      userId,
    } = await req.json();
    const cookieStore = await cookies();
    
    // controllo esistenza della sessione
    const hasSessionToken = cookieStore.has("sessionToken");
    if (!hasSessionToken) {
      rtn.error = "Sessione non trovata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    // //recupero l'email dal token di sessione attuale e lo rimuovo
    var sessionToken = cookieStore.get("sessionToken")?.value;
    const { _id, email } = jwt.decode(sessionToken, process.env.SECRET_TOKEN);

    //controllo payload
    if (!name || name === "") {
      rtn.error = "name is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!emoji || emoji === "") {
      rtn.error = "emoji is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!hexColor || hexColor === "") {
      rtn.error = "hexColor is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!status || status === "") {
      rtn.error = "status is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if (!type || type === "") {
      rtn.error = "type is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
      if (categorieId && !userId || userId === "") {
        rtn.error = "userId is required";
        return new NextResponse(JSON.stringify(rtn), { status: 500 });
      }
    //connessione al database e recupero collezzione "users"
    await connectDB();

    let categorie = {};
    if (categorieId && categorieId != "") {
      //edit
      const filter = { _id: categorieId, userId: _id };
      const update = {
        _id: categorieId,
        name: name,
        type: type,
        hexColor: hexColor,
        emoji: emoji,
        status: status,
        userId: _id,
      };
      categorie = await categoriesModel.updateOne(filter, update);
    } else {
      //create
      categorie = await categoriesModel.create({
        name: name,
        type: type,
        hexColor: hexColor,
        emoji: emoji,
        status: status,
        userId: _id,
      });
    }

    // dataResponse.result = true;
    // rtn.response = dataResponse;
    return new NextResponse(JSON.stringify({ categorie: categorie }), {
      status: 200,
    });
  } catch (error) {
    rtn.error =
      error.message.toString() + " on endpoint:/api/categories/categorieEdit";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
