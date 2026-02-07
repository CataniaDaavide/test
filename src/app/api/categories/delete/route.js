
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { categoriesCollection } from "@/models/categories";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function POST(req) {
    const rtn = { success: false, data: "", error: "" };

    try {
        const { id } = await req.json();

        // Verifica cookie di sessione
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value;
        const user = jwt.verify(sessionToken ?? "", process.env.SECRET_TOKEN);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Utente non autenticato" }),
                { status: 401 }
            );
        }

        // --- VALIDAZIONE INPUT ---
        if (!id) {
            rtn.error = "id is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }

        // --- CONNESSIONE DB ---
        const client = await clientPromise;
        const db = client.db();
        const categories = categoriesCollection(db);

        const now = new Date().toISOString();

        // --- DELETE LOGICO (soft delete) ---
        const result = await categories.updateOne(
            { _id: new ObjectId(id), userId: user.id },
            {
                $set: {
                    isActive: false,
                    updatedAt: now,
                    updatedBy: user.id,
                },
            }
        );

        if (result.matchedCount === 0) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Categoria non trovata" }),
                { status: 404 }
            );
        }

        rtn.success = true;
        rtn.data = { message: "Categoria disattivata con successo" };

        // --- RISPOSTA ---
        return new NextResponse(JSON.stringify(rtn), { status: 200 });

    } catch (error) {
        console.error("Error in /api/categories/delete:", error);
        rtn.error = error.message + " on endpoint:/api/categories/delete";
        rtn.data = "";
        return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
}