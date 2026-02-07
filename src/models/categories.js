export function categoriesCollection(db) {
  return db.collection("categories");
}

/*
MODELLO CATEGORIA
{
  userId: string,       // riferimento all'utente proprietario
  name: string,         // nome della categoria
  emoji: string,        // emoji rappresentativa
  type: string,         // tipo: "U" = Uscita, "E" = Entrata
  hexColor: string,     // colore della categoria in formato HEX
  status: string,       // stato: "A" = Attiva, "I" = Inattiva
  isActive: bool
  createdAt: Date,      // (opzionale) data di creazione
  createdBy: string
  updatedAt: Date,      // (opzionale) data di aggiornamento
  updatedBy: string
}
*/
