import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;

if (!uri) {
  throw new Error("DB_URL non definita nelle env");
}

let client;
let clientPromise;

// Se siamo in sviluppo (hot reload continuo)
if (process.env.NODE_ENV === "development") {

  // Se non esiste ancora una connessione Mongo salvata globalmente
  if (!global._mongoClientPromise) {

    // Creiamo il client Mongo
    client = new MongoClient(uri);

    // Apriamo la connessione e la salviamo in globale
    global._mongoClientPromise = client.connect();
  }

  // Usiamo sempre la connessione salvata
  clientPromise = global._mongoClientPromise;

} else {

  // In produzione creiamo normalmente una nuova connessione
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
