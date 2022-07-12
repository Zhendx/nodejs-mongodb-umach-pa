import Categories from "../models/categories"
import Users from "../models/users";
import Rols from "../models/rols";

export const renderCategory = async (req, res) => {
  const user = await Users.find({_id: req.user.id});
  const idUser = user[0].rol;  
  const rols = await Rols.find().lean();  

  const categories = await Categories.find().lean();  
  res.render("category", { categories: categories, rols: rols, user: idUser, helpers: {
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

export const createCategory = async (req, res) => {
  try {        
    const categories = new Categories({
      category : req.body.category,
      description : req.body.description
    });
    await categories.save();
    req.flash("success_msg", "Registro ingresado con exito"); 
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
  }  
};

export const renderEditCategory = async (req, res) => {
  try {
    const categories = await Categories.findById(req.params.id).lean();
    res.render("editCategory", { categories: categories });
  } catch (error) {
    console.log(error.message);
  }  
};

export const editCategory = async (req, res) => {
  try {
    const {id} = req.params;
    await Categories.findByIdAndUpdate(id, req.body);
    req.flash("success_msg", "Registro actualizado con exito"); 
    res.redirect("/categories");
  } catch (error) {
    console.log(error.message);
  }   
};

export const deleteCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const isUsers = await Users.find({category: id}).limit(1).lean();
    const isIntents = await Categories.find({category: id}).limit(1).lean();

    if(isUsers[0] === undefined && isIntents[0] === undefined) {      
      await Categories.findByIdAndDelete(id);
      req.flash("success_msg", "Registro eliminado con exito");
      res.redirect("/categories");      
    }else{
      req.flash("error_msg", "Existen registros vinculados a este item");      
      res.redirect("/categories");
    }   
  } catch (error) {
    console.log(error.message);
  }     
};