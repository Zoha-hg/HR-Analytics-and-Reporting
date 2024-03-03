const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
// import user from "./models/users.model";
const userModel = require("./models/users.model");
const authorize = require("./email-api/services/googleApiAuthService");



require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your client's origin
  credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
const port = 8000;

// app.use(cors());

const uri = process.env.ATLAS_URI;
// const uri = "mongodb://localhost:27017/HR-Analytics-and-Reporting";
mongoose.connect(uri, {useNewUrlParser: true});
const User = mongoose.model("User", userModel);

const connection = mongoose.connection;

connection.once("open", () => 
{
  console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
app.use("/users", usersRouter);

app.post("/signup", async (req, res) => 
{
  try 
  {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    console.log("Signup attempt with", req.body);
    res.send("Signup successful");
  }
  catch (error) 
  {
    console.error('SignUp error:', error.response ? error.response.data : error.message);
  }
});

app.post("/login", async (req, res) =>
{
  try
  {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.status(200).json("Ready")
        req.session.userId = user._id;
      }
      else{
        res.status(401).json("Invalid Credentials")
      }
    } catch (error) {
      res.status(569).json("Error")
    }
  }
  catch (error)
  {
    console.error('Login error:', error.response ? error.response.data : error.message);
  }
});

app.get('/start-gmail-authorization', async (req, res) => {
  try {
      // Call your authorization logic here
      authorize();
      res.status(200).send('Authorization initiated');
  } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).send('Internal server error');
  }
});

app.listen(8000, () => 
{
  console.log("Server started on port 8000");
});