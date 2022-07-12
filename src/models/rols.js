import {Schema, model} from "mongoose";

const rols = new Schema({    
    rol: {type: String},
    description: {type: String}     
},{
    timestamps: false,
    versionKey: false
});

export default model("rols", rols)