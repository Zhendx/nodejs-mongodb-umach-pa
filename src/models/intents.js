import {Schema, model} from "mongoose";

const intents = new Schema({
    tag: {type: String, required: [true, "La intencion es requerida!"]},
    patterns: {type: Array, required: [true, "Los patrones son requeridos!"]},
    responses: {type: Array, required: [true, "Las respuestas son requeridas!"]},
    category: {type: String, required: [true, "La categoria es requerida!"]},
},{
    timestamps: false,
    versionKey: false
});

export default model("intents", intents)