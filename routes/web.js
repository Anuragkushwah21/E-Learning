const express = require("express");
const FrontController = require("../controller/FrontController");
const AdminController = require("../controller/AdminController");
const CourseController = require("../controller/CourseController");
const checkUserAuth=require("../middleware/auth")
const passport = require('passport')

const route = express.Router();

route.use(passport.initialize())
route.get("/", FrontController.login);
route.get("/register", FrontController.register);
route.get("/home",checkUserAuth, FrontController.home);
route.get("/profile",checkUserAuth, FrontController.profile);

//usercontroller
route.post("/userinsert", FrontController.userinsert);
route.post("/vlogin", FrontController.vlogin);

//admin controller
route.get("/adminDashboard", AdminController.AdminDashboard);
//forgot passsword
route.post('/ForgotPassword',FrontController.forgetPasswordVerify)
route.post('/reset_Password1',FrontController.reset_Password1)
route.get('/reset-password',FrontController.reset_Password)

//logout
route.get("/logout", FrontController.logout);
//verifiy mail
route.get("/verify",FrontController.verifyMail)

//google
// route.get('/',(req,res)=> {
//     res.render("login")
//   })
  
//   route.get('/success',(req,res)=> {
//     res.render("home")
//   })
  route.get('/google',passport.authenticate('google',{ scope: ['profile','email']}));
  
  route.get('/google/callback' , passport.authenticate('google', {failureRedirect:'/failed'}),
  function(req,res){
    // successful auth done
    res.redirect('/home')
  })

module.exports = route;
