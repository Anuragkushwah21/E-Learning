const jwt = require("jsonwebtoken");
const UserModel = require("../model/user");

const checkUserAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.flash("error", "Unaothrized Login");
    res.redirect("/");
  } else {
    const data = jwt.verify(token, "anuragkushwah15394584728655hgbdhjdn");
    const Userdata = await UserModel.findOne({ _id: data.ID });
    // console.log(Userdata)
    req.Userdata = Userdata;
    next();
  }
};

module.exports = checkUserAuth;
