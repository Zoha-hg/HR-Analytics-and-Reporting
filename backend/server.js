const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
// const session = require('express-session');
// require('dotenv').config();
// import user from "./models/users.model";
const userModel = require("./models/users.model");
const Token = require('./models/tokenModel');



require('dotenv').config();

const app = express();
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: process.env.NODE_ENV === "production" }
// }));
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

// app.post("/dashboard", async (req, res) =>{
//   try {
      
//       const dashboardData = {
//           welcomeMessage: "Welcome to your dashboard!",
//           data: "Here's some data you might find interesting.",
//       };
      
//       res.status(200).json(dashboardData);
//   } catch (error) {
//       console.error('Dashboard error:', error);
//       res.status(500).json('Dashboard error: ' + error.message);
//   }
// });

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
  catch
  {
    console.error('Login error:', error.response ? error.response.data : error.message);
  }
});
// app.post("/login", async (req, res) => {
//   try {
//       const { username, password } = req.body;
//       const user = await User.findOne({ username, password });
//       if (user) {
//           // req.session.userId = user._id;  // Save user ID to the session
//           res.status(200).json({ status: "Ready", userId: user._id });
//       } else {
//           res.status(401).json("Invalid Credentials");
//       }
//   } catch (error) {  // Make sure 'error' is defined here
//       console.error('Login error:', error.response ? error.response.data : error.message);
//       res.status(500).json("Error: " + error.message);
//   }
// });

// app.get('/check-token-existence', async (req, res) => {
//   // Check if the user is logged in and has a session
//   if (!req.session.userId) {
//       return res.status(401).json({ message: 'User not authenticated' });
//   }

//   try {
//       // Use the Token model to check if there's a token for this user
//       const token = await Token.findOne({ userId: req.session.userId });
      
//       // If a token is found, send a response indicating token existence
//       if (token) {
//           res.json({ hasToken: true });
//       } else {
//           // If no token is found, indicate that authorization is needed
//           res.json({ hasToken: false });
//       }
//   } catch (error) {
//       console.error('Error checking token existence:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.get('/start-gmail-authorization', async (req, res) => {
//   // Ensure you have a way to identify the user, for example, via session
//   const userId = req.session.userId; 
//   if (!userId) {
//       return res.status(401).send('User not authenticated');
//   }

//   try {
//       await authorize(userId);
//       // After authorization, you might want to redirect or handle the flow differently
//       // This depends on how your authorize function is set up
//   } catch (error) {
//       console.error('Authorization error:', error);
//       res.status(500).send('Internal server error');
//   }
// });


app.listen(8000, () => 
{
  console.log("Server started on port 8000");
});