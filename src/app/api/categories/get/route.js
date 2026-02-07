import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { categoriesCollection } from "@/models/categories";
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

        // --- QUERY PARAMS (OPZIONALE) ---
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // income | expense | null

        // --- CONNESSIONE DB ---
        const client = await clientPromise;
        const db = client.db();
        const categories = categoriesCollection(db);

        const filter = {
            userId: user.id,
            isActive: true
        };

        if (type && ["income", "expense"].includes(type)) {
            filter.type = type;
        }

        // --- RECUPERO CATEGORIE ---
        const result = await categories
        .find(filter)
        .sort({ createdAt: -1 })
        .project({
            id: { $toString: "$_id" },
            _id: 0,
            userId: 1,
            name: 1,
            type: 1,
            emoji: 1,
            hexColor: 1,
            status: 1,
        }).toArray();
        
        // --- RISPOSTA ---
        rtn.success = true;
        rtn.data = { message: "", categories: result };
        
        return new NextResponse(JSON.stringify(rtn), { status: 200 });
    } catch (error) {
        console.error("Error in /api/categories/get:", error);
        rtn.error = error.message + " on endpoint:/api/categories/get";
        return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
}
