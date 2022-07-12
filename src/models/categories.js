import {Schema, model} from "mongoose";

const categories = new Schema({    
    category: {type: String, required: [true, "La categoria es requerida!"]},
    description: {type: String, required: [true, "La descripcion es requerida!"]}  
},{
    timestamps: false,
    versionKey: false
});

export default model("categories", categories)