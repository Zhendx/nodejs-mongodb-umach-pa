import Users from "../models/users";
import Categories from "../models/categories"
import Rols from "../models/rols"
import { transporter } from "../config/mailer";

export const renderUser = async (req, res) => {
  const user = await Users.find({_id: req.user.id});
  const idUser = user[0].rol;  
   
  const users = await Users.find().lean();
  const categories = await Categories.find().lean();
  const rols = await Rols.find().lean();  
  for (var i=0; i < users.length; i++) {
    const category = await Categories.find({_id: users[i].category}).limit(1).lean();
    const rol = await Rols.find({_id: users[i].rol}).limit(1).lean();  
    users[i].category = category[0].category;
    users[i].rol = rol[0].rol;
  }
  res.render("user", { users: users, categories: categories, rols: rols, user: idUser, helpers: {
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
      }     
    }
  }  
  });
};

export const createUser = async (req, res) => {
  try {
    var j = 0;
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+'abcdefghijklmnopqrstuvwxyz0123456789@#$';                  
    
    const emailUser = await Users.find({ email: req.body.email }).limit(1).lean();
    if (emailUser === undefined) {
      req.flash("error_msg", "Existe un usuario con este correo");      
      res.redirect("/users");      
    }else{      
      const users = new Users({
        password: '',
        email: req.body.email,
        rol: req.body.rol,
        category: req.body.category,
      });      
      do{
        for ( var i=1; i<=8; i++) {
          var char = Math.floor(Math.random() * str.length + 1);          
          pass += str.charAt(char);          
        }
        var passTemp = await users.encryptPassword(pass);
        const passUser = await Users.find({ password: passTemp }).limit(1).lean();        
        if(passUser[0] === undefined){
          j = 10;
        }
      }while(j < 1);

      await transporter.sendMail({
        from: '"UTI" <storepcbuild.2020@gmail.com>',
        to: req.body.email,
        subject: "Contraseña asignada ✔",
        html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
              <hr>
              <p>Hola! te saluda UTI, has sido invitado como moderador para la administracion del ingreso de preguntas y 
              respuestas frecuentes, que poseen los estudiantes de su facultad, si ha habido algun error contactese 
              con el administrador Lic. Andres Carvajal</p>
              <p>Su contraseña para el administrador de UTI es: <b>${pass}</b></p>
        `,
      });

      pass = await users.encryptPassword(pass);

      users.password = pass;      
      const savedUser = await users.save();
      
      req.flash("success_msg", "Registro ingresado con exito"); 
      res.redirect("/users");      
    }
  } catch (error) {
    console.log(error);
  }
};

export const renderEditUser = async (req, res) => {
  try {
    const users = await Users.findById(req.params.id).lean();
    const categories = await Categories.find().lean();
    const rols = await Rols.find().lean();  
    res.render("editUser", { users: users, categories: categories, rols: rols, helpers: {
      ifCond: function(v1, operator, v2, options) {
        switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
              return (v1 != v2) ? options.fn(this) : options.inverse(this);
          case '!==':
              return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
        }     
      }
    } 
    });
  } catch (error) {
    console.log(error.message);
  }  
};

export const editUser = async (req, res) => {
  try {
    var j = 0;
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+'abcdefghijklmnopqrstuvwxyz0123456789@#$';
    const {id} = req.params;
    const users = new Users();
    do{
      for ( var i=1; i<=8; i++) {
        var char = Math.floor(Math.random() * str.length + 1);          
        pass += str.charAt(char);          
      }
      var passTemp = await users.encryptPassword(pass);
      const passUser = await Users.find({ password: passTemp }).limit(1).lean();        
      if(passUser[0] === undefined){
        j = 10;
      }
    }while(j < 1);    
    var passw = await users.encryptPassword(pass);
    await Users.findByIdAndUpdate(id, {
      email: req.body.email,
      password: passw,
      rol: req.body.rol,
      category: req.body.category
    });
    await transporter.sendMail({
      from: '"UTI" <storepcbuild.2020@gmail.com>',
      to: req.body.email,
      subject: "Permisos modificados ✔",
      html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
            <hr>
            <p>Hola! te saluda UTI, por decision de mi administrador su permiso ha sido modificado, 
            si ha habido algun error contactese con el administrador</p>
            <p>Su nueva contraseña es: <b>${pass}</b></p>
      `,
    });    
    req.flash("success_msg", "Registro actualizado con exito"); 
    res.redirect("/users");
  } catch (error) {
    console.log(error.message);
  }   
};

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const users = await Users.find({_id: id}).limit(1).lean();
    await transporter.sendMail({
      from: '"UTI" <storepcbuild.2020@gmail.com>',
      to: users[0].email,
      subject: "Permisos eliminados ✔",
      html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
            <hr>
            <p>Hola! te saluda UTI, por motivos de seguridad, su usuario ha sido revocado de mi panel de administracion, 
            gracias por colaborar, ahora si me disculpas tengo informacion que procesar.</p>
            <p>Nos vemos pronto</p>
      `,
    });
    await Users.findByIdAndDelete(id);
    res.redirect("/users");
  } catch (error) {
    console.log(error.message);
  }     
};

//Restablecimiento de contraseña
export const resetPassword = async (req, res) => {
  try {  
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+'abcdefghijklmnopqrstuvwxyz0123456789@#$';
    var email = '';
    var emailConfirm = '';

    email = req.body.email1;
    emailConfirm = req.body.emailConfirm;     
    const users = await Users.findOne({ email: req.body.email1 });
    console.log(users);
    if(users === null || users === undefined){
      req.flash('error_msg', "El correo no coincide con ninguno existente, Intente de nuevo");
      res.redirect("/");
    }else{      
      if(email == emailConfirm){ 
        const user = await Users.find({ email: req.body.email1 }).limit(1).lean(); 
        for(var i=1; i<=8; i++) {
          var char = Math.floor(Math.random() * str.length + 1);          
          pass += str.charAt(char);          
        }            
        var passw = await users.encryptPassword(pass);          
        const isReset = await Users.findByIdAndUpdate(user[0]._id, { password: passw });
        if(isReset){
          await transporter.sendMail({
            from: '"UTI" <storepcbuild.2020@gmail.com>',
            to: req.body.email1,
            subject: "Restablecimiento de contraseña ✔",
            html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
                  <hr>
                  <p>Hola! te saluda UTI, me he enterado que se te ha olvidado la contraseña 
                  por motivos de seguridad la contraseña antes dada es inaccesible para mi, pero no estes triste
                  tu amiga UTI te ayudara con otra, pero ¡shhh...! no le digas al administrador,
                  revisa tu correo para saber tu nueva contraseña.</p>              
                  <p>Su nueva contraseña es: <b>${pass}</b></p>
            `,
          });
        }
        req.flash("success_msg", "Se ha restablecido la contraseña con exito"); 
        res.redirect("/");
      }else{
        req.flash('error_msg', "Su correo de confirmacion no coincide, Intente de nuevo");
        res.redirect("/");
      }
    }
      
  } catch (error) {
    console.log(error.message);
  }   
};