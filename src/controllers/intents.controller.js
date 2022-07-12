import Intents from "../models/intents"
import Users from "../models/users";
import Rols from "../models/rols";
import Categories from "../models/categories";

export const renderChatbot = async (req, res) => { 
  var nameRol = "Moderador";
  var intents = '';
  const user = await Users.find({_id: req.user.id});
  const idUser = user[0].rol;     
  const rols = await Rols.find().lean();
  const categories = await Categories.find().lean();  
  for(let i=0; i<rols.length; i++){
    if(idUser == rols[i]._id){
      nameRol = rols[i].rol;
    }    
  }
  const idCategory = user[0].category; 
   
  if(nameRol == "Administrador"){
    intents = await Intents.find().lean();
    for(let i=0; i<intents.length; i++){
      for(let j=0; j<categories.length; j++){
        if(intents[i].category == categories[j]._id){
          intents[i].category = categories[j].category;
        }
      }    
    }     
  }else{
    intents = await Intents.find({category: idCategory}).lean(); 
    for(let i=0; i<intents.length; i++){
      for(let j=0; j<categories.length; j++){
        if(intents[i].category == categories[j]._id){
          intents[i].category = categories[j].category;
        }
      }    
    }   
  }
  res.render("chatbot", { intents: intents,  user: idUser, rols: rols, helpers: {
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

export const createChatbot = async (req, res) => {
  try {
    const user = await Users.find({_id: req.user.id});
    const idCategory = user[0].category;
    var pattern = [];
    var response = [];
    pattern = req.body.patterns;
    response = req.body.responses;    
    
    const intents = new Intents({
      tag : req.body.tag,
      patterns : pattern,
      responses : response,
      category : idCategory    
    });
    await intents.save();
    req.flash("success_msg", "Intencion añadida con exito"); 
    res.redirect("/intents");
  } catch (error) {
    console.log(error);
  }  
};

export const renderEditChatbot = async (req, res) => {
  try {
    const intents = await Intents.findById(req.params.id).lean();
    res.render("editChatbot", { intents: intents });
  } catch (error) {
    console.log(error.message);
  }  
};

export const editChatbot = async (req, res) => {
  try {
    const {id} = req.params;
    await Intents.findByIdAndUpdate(id, req.body);
    res.redirect("/intents");
  } catch (error) {
    console.log(error.message);
  }   
};

export const deleteChatbot = async (req, res) => {
  try {
    const {id} = req.params;
    await Intents.findByIdAndDelete(id);
    res.redirect("/intents");
  } catch (error) {
    console.log(error.message);
  }     
};