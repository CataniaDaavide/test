import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/app/core/mongodbFunctions";
import { Currency } from "lucide-react";
import { accountsModel } from "@/app/models/accountsModel";

export async function POST(req) {
  //inzizializzazioni valori di ritorno della chiamta
  const rtn = { response: "", error: "" };
  const dataResponse = {};

  try {
    const {
      _id: accountId,
      name,
      emoji,
      hexColor,
      status,
      type,
      userId,
      amount,
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
    if (!amount || amount === "") {
      rtn.error = "amount is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    if ((accountId && !userId) || userId === "") {
      rtn.error = "userId is required";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
    //connessione al database e recupero collezzione "users"
    await connectDB();

    let account = {};
    const convertedAmount = Number(amount).toFixed(2);
    if (accountId && accountId != "") {
      //edit
      const filter = { _id: accountId, userId: _id };
      const update = {
        _id: accountId,
        name: name,
        type: type,
        hexColor: hexColor,
        emoji: emoji,
        status: status,
        userId: _id,
        amount: convertedAmount,
      };
      account = await accountsModel.updateOne(filter, update);      
    } else {
      //create
      account = await accountsModel.create({
        name: name,
        type: type,
        hexColor: hexColor,
        emoji: emoji,
        status: status,
        userId: _id,
        amount: convertedAmount,
      });
    }

    // dataResponse.result = true;
    // rtn.response = dataResponse;
    return new NextResponse(JSON.stringify({ account: account }), {
      status: 200,
    });
  } catch (error) {
    rtn.error =
      error.message.toString() + " on endpoint:/api/categories/categorieEdit";
    rtn.response = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}
