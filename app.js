const express = require("express");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const productRoute = require("./routes/product");
const dashboardRoute = require("./routes/dashboard");
const profileRoute = require("./routes/profile");
const imageUpload = require("./routes/imageUpload");
const forgetPassword = require("./routes/forgetPassword");
const Auth = require("./middleware/auth");


const app = express();
app.use(cors());
app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
require('dotenv').config();
app.use(logger());

// directory management
app.use('/images', express.static(path.join(__dirname, './images/')));
app.use('/css', express.static(path.join(__dirname, './views/css/')));
app.use('/bootstrap-css', express.static(path.join(__dirname, './views/Libraries/bootstrap/css/')));
app.use('/jquery', express.static(path.join(__dirname, './views/Libraries/jquery/')));
app.use('/favicon.ico', express.static('./favicon.ico'));

// session management
app.use(session({secret:'my-secret', saveUninitialized: false, resave: false}));

// managing routes
app.use(loginRouter);
app.use(registerRouter);
app.use(forgetPassword);
app.use(Auth);
// auth routes
app.use(imageUpload);
app.use(productRoute);
app.use(dashboardRoute);
app.use(profileRoute);

app.use((req,res,next)=>{
    res.render('404');
});


app.listen(process.env.PORT, ()=>{
    console.log("Server running at port : " + process.env.PORT);
});

