const UserModel = require("../model/user");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const{name,email,image}=req.Userdata
      res.render("home",{
        name:name,
        email:email,
        image:image,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", {
        msg: req.flash("Success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const{name,email,image}=req.Userdata
      res.render("profile", {
        name:name,
        email:email,
        image:image,
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  // registration
  static userinsert = async (req, res) => {
    try {
      // console.log(req.body)
      // console.log(req.files.image);
      const file = req.files.image;
      const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "usserprofile",
      });
      // console.log(uploadImage)
      const { name, email, password, confirmpassword } = req.body;
      const student = await UserModel.findOne({ email: email });
      if (student) {
        req.flash("error", "Email alredy exit");
        res.redirect("/register");
      } else {
        if (name && email && password && confirmpassword) {
          if (password == confirmpassword) {
            const haspassword = await bcrypt.hash(password, 10);
            const result = new UserModel({
              name: name,
              email: email,
              password: haspassword,
              image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
              },
            });

            const Userdata = await result.save();
            if (Userdata) {
              const token = jwt.sign(
                {
                  ID: Userdata.id,
                },
                "anuragkushwah15394584728655hgbdhjdn"
              );
              // console.log(token)
              res.cookie("token", token);
              this.sendVerifyEmail(name, email, Userdata._id);
              req.flash(
                "Success",
                "Registration Success plz verify your email!"
              );
              res.redirect("/register");
            } else {
              req.flash("error", "You Are Not Register");
              res.redirect("/register");
            }
            req.flash("Success", "Register success! plz Login");
            res.redirect("/"); //url
          } else {
            req.flash("error", "Password and confirm Password not same");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All Field req");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static vlogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const student = await UserModel.findOne({ email: email });
        if (student != null) {
          const isMatched = await bcrypt.compare(password, student.password);
          if (isMatched) {
            if (student.role === "user" && student.is_varified == 1) {
              const token = jwt.sign(
                { ID: student.id },
                "anuragkushwah15394584728655hgbdhjdn"
              );
              res.cookie("token", token);
              res.redirect("/adminDashboard");
            } else {
              req.flash("error", "Plz verified Email Address");
              res.redirect("/");
            }
          } else {
            req.flash("error", "Email or Password is not valid");
            res.redirect("/");
          }
        } else {
          req.flash("error", "You are not a registered user");
          res.redirect("/");
        }
      } else {
        req.flash("error", "All Fields Required");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendVerifyEmail = async (name, email, user_id) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "anuragkofficial21@gmail.com",
        pass: "bjlgmcajfhsvpwwz",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: ` For Varification mail`, // Subject line
      text: "hello", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:2200/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.', // html body
    });
  };

  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, token) => {
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "anuragkofficial21@gmail.com",
        pass: "bjlgmcajfhsvpwwz",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "hello", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:2200/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };
  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_varified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset_password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
