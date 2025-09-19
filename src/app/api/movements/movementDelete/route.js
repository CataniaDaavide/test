import { NextResponse } from "next/server";
import connectDB from "@/app/core/mongodbFunctions";
import { movementsModel } from "@/app/models/movementModel";
import { accountsModel } from "@/app/models/accountsModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function POST(req) {
    try {
        const payload = await req.json()
        const { _id } = payload

        const cookieStore = await cookies()

        //controllo esistenza della sessione
        const hasSessionToken = cookieStore.has("sessionToken");
        if (!hasSessionToken) {
            rtn.error = "Sessione non trovata";
            return new NextResponse(JSON.stringify(rtn), { status: 500 });
        }

        //recupero l'email dal token di sessione attuale e lo rimuovo
        var sessionToken = cookieStore.get("sessionToken")?.value;
        const { _id: userId } = jwt.decode(sessionToken, process.env.SECRET_TOKEN);


        await connectDB()

        const filter = { _id: _id, userId: userId }
        let movement = await movementsModel.findOne(filter)
        if (!movement) {
            return new NextResponse(JSON.stringify({ message: "Moviemento non trovato" }), { status: 404 });
        }
        const type = movement.type.toString().trim().toUpperCase()

        for (let acc of movement.accounts) {
            const { accountId, amount } = acc
            const filter = {
                _id: accountId
            }
            const update = {
                "$inc": {
                    amount: type === "U" ? + amount : - amount
                }
            }
            await accountsModel.findOneAndUpdate(filter, update);
        }

        movement = await movementsModel.findOneAndDelete(filter)
        return new NextResponse(JSON.stringify({ message: "Movimento eliminato", movement: movement }), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Errore api:movements/deleteMovement" }), { status: 500 })
    }
}