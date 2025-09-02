import mongoose from "mongoose";

delete mongoose.models['money-accounts'];

const AccountsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    emoji: { type: String, required: true },
    type: { type: String, required: true },
    hexColor: { type: String, required: true },
    status: { type: String, required: true },
});

const accountsModel = mongoose.model('money-accounts', AccountsSchema);

export { accountsModel };
