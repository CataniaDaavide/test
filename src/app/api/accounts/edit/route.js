import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { accountsCollection } from "@/models/accounts";
import { parseAmount } from "@/lib/utils";

export async function POST(req) {
    const rtn = { success: false, data: "", error: "" };

    try {
        const { id, name, amount, type, emoji, hexColor } = await req.json();

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
        if (amount === null || amount === undefined) {
            rtn.error = "amount is required";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }
        const parsedAmount = parseAmount(amount);
        if (isNaN(parsedAmount)) {
            rtn.error = "amount must be a valid number";
            return new NextResponse(JSON.stringify(rtn), { status: 400 });
        }

        if (!type || !["bank", "wallet", "voucher", "libretto", "crypto", "cash", "other"].includes(type)) {
            rtn.error = "type is required and must be 'bank', 'wallet', 'voucher', 'libretto', 'crypto', 'cash', 'other'";
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
        const accounts = accountsCollection(db);

        const now = new Date().toISOString();
        if (id == "") {
            // --- CREAZIONE CONTO ---
            const result = await accounts.insertOne({
                userId: user.id,
                name: name,
                amount: parsedAmount,
                type: type,
                emoji: emoji,
                hexColor: hexColor,
                isActive: true,
                createdAt: now,
                createdBy: user.id,
                updatedAt: now,
                updatedBy: user.id,
            });
            rtn.data = { message: "Conto creato con successo", account: result };
        } else {
            // --- MODIFICA CONTO ---
            const result = await accounts.updateOne(
                { _id: new ObjectId(id), userId: user.id }, // filtro
                {
                    $set: {
                        name,
                        amount: parsedAmount,
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
                    error: "Conto non trovato"
                }), { status: 404 });
            }
            rtn.data = { message: "Conto modificato con successo", account: result };
        }

        // --- RISPOSTA ---
        rtn.success = true;

        return new NextResponse(JSON.stringify(rtn), { status: 200 });
    } catch (error) {
        console.error("Error in /api/accounts/edit:", error);
        rtn.error = error.message + " on endpoint:/api/accounts/edit";
        rtn.response = "";
        return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }
}
