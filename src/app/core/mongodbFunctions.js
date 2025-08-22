import mongoose, { mongo } from "mongoose";

// Funzione per connettersi al database 
export default async function connectDB(){
    const url = process.env.DB_URL
    await mongoose.connect(url).then(() => {})
}
