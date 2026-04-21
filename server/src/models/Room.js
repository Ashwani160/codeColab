import mongoose from "mongoose";

const roomSchema =new mongoose.Schema({
    roomId: {type: String, required: true, unique: true},
    code:{type: String, default: ""},
    language:{type: String, default: "javascript"},
}, {timestamps: true})

export default mongoose.model('Room', roomSchema);