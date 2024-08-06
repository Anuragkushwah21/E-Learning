const mongoose = require("mongoose");
const Local_URL = "mongodb://0.0.0.0:27017/e-learning";
const connectdb = () => {
  mongoose
    .connect(Local_URL)
    // .connect(Live_URL)

    .then(() => {
      console.log("connected sucessfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectdb;
