import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { accountsCollection } from "@/models/accounts";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
    const rtn = { success: false, data: "", error: "" };

    try {

        // --- VERIFICA COOKIE DI SESSIONE ---
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value;
        const user = jwt.verify(sessionToken ?? "", process.env.SECRET_TOKEN);

        if (!user) {
            return new NextResponse(JSON.stringify({
                success: false,
                error: "Utente non autenticato"
            }), { status: 401 });
        }

        // --- CONNESSIONE DB ---
        const client = await clientPromise;
        const db = client.db();
        const accounts = accountsCollection(db);

        const filter = {
            userId: user.id,
            isActive: true
        };

        // --- RECUPERO CONTI ---
        const result = await accounts
            .find(filter)
            .sort({ createdAt: -1 })
            .project({
                id: { $toString: "$_id" },
                _id: 0,
               name:1,
               amount:1,
               emoji:1,
               type:1,
               hexColor:1,
               hexColor:1,
            })
            .toArray();

        // --- RISPOSTA ---
        rtn.success = true;
        rtn.data = { message: "", accounts: result };

        return new NextResponse(JSON.stringify(rtn), { status: 200 });
    } catch (error) {
        console.error("Error in /api/accounts/get:", error);
        rtn.error = error.message + " on endpoint:/api/accounts/get";
        return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
}
