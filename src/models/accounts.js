export function accountsCollection(db) {
  return db.collection("accounts");
}

/*
MODELLO ACCOUNT / CONTO

{
  userId: "682e280409285bb856379161",   // ID dell'utente proprietario del conto
  name: "Posteapay",                     // Nome del conto, visibile all'utente
  amount: 305.44,                        // Saldo corrente del conto
  emoji: "💳",                            // Emoji rappresentativa del conto
  type: "bank",                           // Tipo di conto, valori possibili:
                                          // "bank" = conto bancario
                                          // "wallet" = portafoglio digitale (PayPal, Satispay, ecc.)
                                          // "voucher" = buoni prepagati o gift card
                                          // "libretto" = libretto bancario o postale
                                          // "crypto" = wallet di criptovalute
                                          // "cash" = contanti fisici
                                          // "other" = altro tipo generico
  hexColor: "#FCC419",                    // Colore del conto in formato HEX, utile per UI
  isActive: true,                         // Stato del conto: true = attivo, false = eliminato/inattivo
  createdAt: "2026-02-06T23:28:53.628Z", // Data di creazione del conto
  createdBy: "6982724cc260c953f2f2db94", // ID dell'utente che ha creato il conto
  updatedAt: "2026-02-06T23:29:07.595Z", // Data di ultima modifica del conto
  updatedBy: "6982724cc260c953f2f2db94"  // ID dell'utente che ha modificato il conto l'ultima volta
}
*/

