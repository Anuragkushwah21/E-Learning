const express = require("express");
const app = express();
const port = 2200;
const web = require("./routes/web");
const connectdb = require("./db/connectdb");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");

app.use(fileupload({ useTempFiles: true }));

//tokenget
app.use(cookieParser());
//connectdb
connectdb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

const session = require("express-session");
const flash = require("connect-flash");

//message
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: flash,
    saveUninitialized: flash,
  })
);

app.use(flash());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", web);
app.listen(port, () => console.log(`Server Start listening on port ${port}!`));
