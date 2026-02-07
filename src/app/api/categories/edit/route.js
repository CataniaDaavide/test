import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { categoriesCollection } from "@/models/categories";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function POST(req) {
    const rtn = { success: false, data: "", error: "" };

    try {
        const { id, name, type, emoji, hexColor } = await req.json();

        // Verifica cookie di sessione
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value;
        const user = jwt.verify(sessionToken ?? "", process.env.SECRET_TOKEN)
        if (!user) {
            return res.status(401).json({ error: "Utente non autenticato" });
        }

        // --- VALIDAZIONE INPUT ---
        if (!name || name.trim() === "") {
            rtn.error = "mame is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }
        if (!type || !["income", "expense"].includes(type)) {
            rtn.error = "type is required and must be 'income' or 'expense'";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }
        if (!emoji || emoji.trim() === "") {
            rtn.error = "emoji is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }
        if (!hexColor || hexColor.trim() === "") {
            rtn.error = "hexColor is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }

        // --- CONNESSIONE DB ---
        const client = await clientPromise;
        const db = client.db();
        const categories = categoriesCollection(db);

        const now = new Date().toISOString();
        if (id == "") {
            // --- CREAZIONE CATEGORIA ---
            const result = await categories.insertOne({
                userId: user.id,
                name: name,
                type: type,
                emoji: emoji,
                hexColor: hexColor,
                isActive: true,
                createdAt: now,
                createdBy: user.id,
                updatedAt: now,
                updatedBy: user.id,
            });
            rtn.data = { message: "Categoria creata con successo", category: result };
        } else {
            // --- MODIFICA CATEGORIA ---
            const result = await categories.updateOne(
                { _id: new ObjectId(id), userId: user.id }, // filtro
                {
                    $set: {
                        name,
                        type: type,
                        emoji,
                        hexColor,
                        updatedAt: now,
                        updatedBy: user.id,
                    },
                }
            );

            if (result.matchedCount === 0) {
                return new NextResponse(JSON.stringify({
                    success: false,
                    error: "Categoria non trovata"
                }), { status: 404 });
            }
            rtn.data = { message: "Categoria modificata con successo", category: result };
        }

        // --- RISPOSTA ---
        rtn.success = true;

        return new NextResponse(JSON.stringify(rtn), { status: 200 });
    } catch (error) {
        console.error("Error in /api/categories/edit:", error);
        rtn.error = error.message + " on endpoint:/api/categories/edit";
        rtn.response = "";
        return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
}
