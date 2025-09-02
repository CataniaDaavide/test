import mongoose from "mongoose";

delete mongoose.models['movements'];

const movementsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
    categorieId: { type: String, required: true },
    type: { type: String, required: true },
    accounts: [
        {
            accountId: { type: String, required: true },
            amount: { type: Number, required: true },
        }
    ],
});

const movementsModel = mongoose.model('movements', movementsSchema);

export { movementsModel };
