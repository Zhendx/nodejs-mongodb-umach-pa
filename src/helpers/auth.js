import Users from "../models/users";
import Rols from "../models/rols";
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', "El usuario no se encuentra autorizado");
    res.redirect("/");
};

helpers.isAdmin = async (req, res, next) => {
    const user = await Users.findById(req.user.id);
    const rol = await Rols.find({_id: user.rol});    
    if(rol[0].rol === "Administrador"){
        next();
    }else{
        res.redirect('/intents');
        req.flash('error_msg', "No tienes permiso para acceder a esta opcion");
    }
};

helpers.isModerator = async (req, res, next) => {
    const user = await Users.findById(req.user.id);
    const rol = await Rols.find({_id: user.rol});    
    if(rol[0].rol === "Moderador" || rol[0].rol === "Administrador"){
        next();
    }else{
        res.redirect('/intents');
        req.flash('error_msg', "No tienes permiso para acceder a esta opcion");
    }
};

helpers.isVisitor = async (req, res, next) => {
    const user = await Users.findById(req.user.id);
    const rol = await Rols.find({_id: user.rol});    
    if(rol[0].rol === "Moderador" || rol[0].rol === "Administrador" || rol[0].rol === "Visitante"){
        next();
    }else{
        req.flash('error_msg', "No tienes permiso para acceder a esta opcion");
        res.redirect('/intents');        
    } 
};

module.exports = helpers;