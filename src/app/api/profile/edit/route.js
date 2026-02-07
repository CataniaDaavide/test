import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { userCollection } from "@/models/users";

export async function POST(req) {
    const rtn = { success: false, data: "", error: "" };

    try {
        const { id, name, surname, bio, bannerUrl, avatarUrl } = await req.json();

        // Verifica cookie di sessione
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value;
        const user = jwt.verify(sessionToken ?? "", process.env.SECRET_TOKEN)
        if (!user) {
            return res.status(401).json({ error: "Utente non autenticato" });
        }

        // --- VALIDAZIONE INPUT ---
        if (!id || id.trim() === "") {
            rtn.error = "id is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }
        if (!name || name.trim() === "") {
            rtn.error = "mame is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }
        if (!surname || surname.trim() === "") {
            rtn.error = "surname is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }

        // --- CONNESSIONE DB ---
        const client = await clientPromise;
        const db = client.db();
        const users = userCollection(db);

        const now = new Date().toISOString();
        // --- MODIFICA CATEGORIA ---
        const result = await users.updateOne(
            { _id: new ObjectId(id)}, // filtro
            {
                $set: {
                    name,
                    surname,
                    bio,
                    bannerUrl,
                    avatarUrl,
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
