import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const users = new Schema({    
    email: {type: String, required: [true, "El email es requerido!"]},
    password: {type: String, required: [true, "La password es requerida!"]},    
    rol: {type: String, required: [true, "El rol es requerido!"]},
    category: {type: String, required: [true, "La categoria es requerida!"]}
},{
    timestamps: false,
    versionKey: false
});

users.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

users.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default model("users", users)