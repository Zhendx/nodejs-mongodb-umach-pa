import { Router } from "express";
import { renderChatbot, createChatbot, renderEditChatbot, editChatbot, deleteChatbot } from "../controllers/intents.controller"
import { renderUser, createUser, renderEditUser, editUser, deleteUser, resetPassword } from "../controllers/users.controller";
import { renderCategory, createCategory, renderEditCategory, editCategory, deleteCategory } from "../controllers/categories.controller"
import passport from "passport";
import { isAuthenticated, isAdmin, isModerator, isVisitor } from "../helpers/auth";
const router = Router();

//Rutas de Login
router.get("/", async (req, res) => {  
  res.render("index");
});

router.post("/login", passport.authenticate('local', {
  successRedirect : "/intents",
  failureRedirect : "/",
  failureFlash: true
}));

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });      
});

router.get("/users", [isAuthenticated, isAdmin], renderUser);

router.post("/users/add", [isAuthenticated, isAdmin], createUser);

router.get("/users/:id/edit", [isAuthenticated, isAdmin], renderEditUser);

router.post("/users/:id/edit", [isAuthenticated, isAdmin], editUser);

router.get("/users/:id/delete", [isAuthenticated, isAdmin], deleteUser);

//Rutas de Intents
router.get("/intents", [isAuthenticated, isVisitor], renderChatbot);

router.post("/intents/add", [isAuthenticated, isModerator], createChatbot);

router.get("/intents/:id/edit", [isAuthenticated, isModerator], renderEditChatbot);

router.post("/intents/:id/edit", [isAuthenticated, isModerator], editChatbot);

router.get("/intents/:id/delete", [isAuthenticated, isModerator], deleteChatbot);

//Rutas de Categories
router.get("/categories", [isAuthenticated, isAdmin], renderCategory);

router.post("/categories/add", [isAuthenticated, isAdmin], createCategory);

router.get("/categories/:id/edit", [isAuthenticated, isAdmin], renderEditCategory);

router.post("/categories/:id/edit", [isAuthenticated, isAdmin], editCategory);

router.get("/categories/:id/delete", [isAuthenticated, isAdmin], deleteCategory);

//Rutas de Restablecimiento de contraseña
router.post("/resetPassword", resetPassword);

export default router;
