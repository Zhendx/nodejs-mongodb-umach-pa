import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Users from "../models/users"

passport.use(new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    const user = await Users.findOne({email: email});    
    if(!user){
        return done(null, false, {message: "Usuario no encontrado"});
    }
    const match = await user.matchPassword(password);
    if(match){
        return done(null, user);
    }else{
        return done(null, false, {message: "Contraseña incorrecta"});
    }    
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
        done(err, user);
    });
});