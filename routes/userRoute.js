const express = require("express");
const user_route = express.Router();
const bodyParser = require("body-parser");
const session = require("express-session");

const { SESSION_SECRET } = process.env;
user_route.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const userController = require("../controllers/userController");
const relationcontroller = require("../controllers/userrelationship");
const chatusercontroller = require("../controllers/chatusercontroller");
const auth = require("../middlewares/auth");
const userrelationmodel = require("../models/userrelationmodel");

user_route.get("/", auth.islogout, userController.loadlogin);
user_route.post("/", userController.login);

user_route.get('/forgetpassword',auth.islogout,userController.loadforgetpage)
user_route.post('/requestPasswordReset',userController.handleforget)

user_route.get('/varification',auth.islogout,auth.isemail,userController.loadvarifiactionpage)
user_route.post('/varification',userController.handleotp)

user_route.get('/resetpassword',auth.islogout,auth.isotp,userController.loadresetpasswordpage)
user_route.post('/resetpassword',userController.resetpassword)

user_route.get("/register", auth.islogout, userController.registerload);
user_route.post("/register", userController.registerhandle);

user_route.get("/logout", auth.islogin, userController.logout);
user_route.get("/dashboard", auth.islogin, userController.loaddashboard);

user_route.post("/save-chat",userController.savechat);
user_route.post("/delete-chat", userController.deletechat);

user_route.post("/save-react", userController.savereact);
user_route.post("/save-edit", userController.saveedit);
user_route.post("/search", userController.search);


user_route.post("/create-group", relationcontroller.creategroup);

user_route.post("/follow", relationcontroller.addfollower);
user_route.post("/addnotification", relationcontroller.addnottification);


user_route.get("/createroom",chatusercontroller.createroom);
user_route.post("/createroom",chatusercontroller.createroomhandle);
user_route.get("/joinroom",chatusercontroller.loadjoinroom);
user_route.post("/joinroom",chatusercontroller.joinroomhandle);
user_route.get("/room", chatusercontroller.loadroom)



// user_route.get("*", auth.islogout, (req, res) => {
//   res.redirect("/");
// });

module.exports = user_route;
