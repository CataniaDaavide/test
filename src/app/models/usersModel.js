import mongoose from "mongoose";

delete mongoose.models['users'];

const usersSchema = new mongoose.Schema({
    userId: { type: String, required: false},
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
});

const usersModel = mongoose.model('users', usersSchema);

export { usersModel };
