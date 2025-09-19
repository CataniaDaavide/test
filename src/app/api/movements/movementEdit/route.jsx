import { NextResponse } from "next/server";
import connectDB from "@/app/core/mongodbFunctions";
import { movementsModel } from "@/app/models/movementModel";
import { categoriesModel } from "@/app/models/categoriesModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { accountsModel } from "@/app/models/accountsModel";

/* funzione che si occupa di aggiorare il singolo conto */
async function updateAccountBalance(accountId, amount) {
  const filter = { _id: accountId};
  const options = { $inc: { amount } };
  await accountsModel.findOneAndUpdate(filter, options);
}

/** Calcola le differenze tra vecchi e nuovi account */
function calculateAccountDeltas(oldAccounts, newAccounts) {
  const oldMap = new Map(oldAccounts.map((obj) => [obj.accountId, obj.amount]));
  const newMap = new Map(newAccounts.map((obj) => [obj.accountId, obj.amount]));
  const allAccountIds = new Set([...oldMap.keys(), ...newMap.keys()]);

  const deltas = [];
  for (let accountId of allAccountIds) {
    const oldAmount = oldMap.get(accountId) || 0;
    const newAmount = newMap.get(accountId) || 0;
    const delta = newAmount - oldAmount; // differenza: nuovo - vecchio
    if (delta !== 0) {
      deltas.push({ accountId, amount: delta });
    }
  }
  return deltas;
}

/** Aggiorna tutti i saldi degli account in base al tipo del movimento */
async function applyAccountChanges(accounts, type) {
  for (let acc of accounts) {
    const amountToApply = type === "U" ? -acc.amount : acc.amount;
    await updateAccountBalance(acc.accountId, amountToApply);
  }
}

/** Gestione creazione movimento */
async function createMovement(userId, date, description, categorieId, type, accounts) {
  const data = { userId, date, description, categorieId, accounts, type };
  await applyAccountChanges(accounts, type); // aggiorna i saldi
  const movement = await movementsModel.create(data);
  return movement;
}

/** Gestione modifica movimento */
async function editMovement(movement, date, description, categorieId, type, accounts) {
  const deltas = calculateAccountDeltas(movement.accounts, accounts);

  // Applica le differenze correttamente in base al tipo
  for (let acc of deltas) {
    const amountToApply = type === "U" ? -acc.amount : acc.amount;
    await updateAccountBalance(acc.accountId, amountToApply);
  }

  // Aggiorna il movimento
  const update = { date, description, categorieId, accounts, type };
  const updatedMovement = await movementsModel.findOneAndUpdate({ _id: movement._id }, update, { new: true });
  return updatedMovement;
}

/** Endpoint principale */
export async function POST(req) {
  try {
    const payload = await req.json();
    const { _id = "", date, description, categorieId, accounts } = payload;

    const cookieStore = await cookies();

    //controllo esistenza della sessione
    const hasSessionToken = cookieStore.has("sessionToken");
    if (!hasSessionToken) {
      rtn.error = "Sessione non trovata";
      return new NextResponse(JSON.stringify(rtn), { status: 500 });
    }

    //recupero l'email dal token di sessione attuale e lo rimuovo
    var sessionToken = cookieStore.get("sessionToken")?.value;
    const { _id: userId } = jwt.decode(sessionToken, process.env.SECRET_TOKEN);

    await connectDB();

    const categorie = await categoriesModel.findOne({ _id: categorieId });
    if (!categorie) {
      return new NextResponse(JSON.stringify({ message: "Categoria non trovata" }), { status: 404 });
    }

    const type = categorie.type.toString().trim().toUpperCase();

    if (_id === "") {
      // Creazione
      const movement = await createMovement(userId, date, description, categorieId, type, accounts);
      return new NextResponse(JSON.stringify({ message: "Movimento creato", movement }), { status: 200 });
    } else {
      // Modifica
      const movement = await movementsModel.findOne({ _id });
      if (!movement) {
        return new NextResponse(JSON.stringify({ message: "Movimento non trovato" }), { status: 404 });
      }

      const updatedMovement = await editMovement(movement, date, description, categorieId, type, accounts);
      return new NextResponse(JSON.stringify({ message: "Movimento modificato", movement: updatedMovement }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Errore api:movements/editMovement" }), { status: 500 });
  }
}
