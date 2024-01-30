const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
// import user from "./models/users.model";
const userModel = require("./models/users.model");


require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

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
app.use("/users", usersRouter);

app.post("/signup", async (req, res) => 
{
  try 
  {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    // res.json(user{ username, email, password, role});
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
      }
      else{
        res.status(401).json("Invalid Credentials")
      }
    } catch (error) {
      res.status(569).json("Suckmydick")
    }
  }
  catch
  {
    console.error('Login error:', error.response ? error.response.data : error.message);
  }
});

app.listen(8000, () => 
{
  console.log("Server started on port 8000");
});