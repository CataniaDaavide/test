import mongoose from "mongoose";

delete mongoose.models['categories'];

const categoriesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    type: { type: String, required: true },
    hexColor: { type: String, required: true },
    status: { type: String, required: true },
});

const categoriesModel = mongoose.model('categories', categoriesSchema);

export { categoriesModel };
