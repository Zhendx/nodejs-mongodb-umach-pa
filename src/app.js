import express from "express";
import session from "express-session";
import { create } from "express-handlebars";
import indexRoutes from "./routes/index.routes";
import path from "path";
import morgan from "morgan";
import passport from "passport";
import flash from "connect-flash";

//Initializations
const app = express();
require('./config/passport');

//settings
var hbs = create({});

app.set('port', process.env.PORT || 9999);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaulLayout: "main",
    extname: ".hbs",
  }).engine
);

app.set("view engine", ".hbs");


// register new function
hbs.handlebars.registerHelper('compareStrings', function(p, q, options) {
  return (p == q) ? options.fn(this) : options.inverse(this);
});

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "mysecretapp",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Routes
app.use(indexRoutes);

//Static files
app.use(express.static(path.join(__dirname, "public")));

export default app;
