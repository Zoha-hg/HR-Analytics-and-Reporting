const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require("./models/users.model");
const feedbackModel = require("./models/feedback_model");
const hrModel = require("./models/hr_model");
const departmentModel = require("./models/department_model");
const employeeModel = require("./models/employee_model");
const managerModel = require("./models/manager_model");
const taskModel = require("./models/tasks_model");
const dailyTrackingModel = require("./models/daily_tracking_model");



require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true});
const User = mongoose.model("User", userModel);
const Feedback = mongoose.model("Feedback", feedbackModel);
const Employee = mongoose.model("Employee", employeeModel);
const Manager = mongoose.model("Manager", managerModel);
const Task = mongoose.model("Task", taskModel);
const DailyTracking = mongoose.model("DailyTracking", dailyTrackingModel);
const Department = mongoose.model("Department", departmentModel);
const HR = mongoose.model("HR", hrModel);


const connection = mongoose.connection;

connection.once("open", () => 
{
  console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint to get user role
app.get('/user-role', authenticateToken, async (req, res) => {
  // console.log('User:', req)
  try {
    // console.log('Fetching user role for:', req.user.username)
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).send('User not found');
    // console.log(user)
    res.json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Failed to fetch user role' });
  }
});

// API Endpoint to get username.
app.get('/user-name', authenticateToken, async (req, res) => {
  // console.log('User:', req)
  try {
    // console.log('Fetching user role for:', req.user.username)
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).send('User not found');
    // console.log(user)
    res.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Failed to fetch user role' });
  }
});


app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Failed to sign up. Please try again.' });
  }
});


app.post("/login", async (req, res) => 
{
  try 
  {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) 
    {
      
      const token = jwt.sign({ username: user.username, role: user.role }, process.env.TOKEN_SECRET);

      res.status(200).json({ token });
    } 
    else 
    {
      res.status(401).json("Invalid credentials");
    }
  } 
  catch (error) 
  {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to log in. Please try again.' });
  }
});

app.get('/verify-token', authenticateToken, (req, res) => {
  // Assuming req.user is set by authenticateToken middleware
  res.status(200).json({ username: req.user.username });
});



app.listen(8000, () => 
{
  console.log("Server started on port 8000");
});

app.post('/createform', async (req, res) => {
  try {
      const {filled, title, description, start_time, end_time, questions } = req.body;

      let form_id = 0;
    const lastFeedback = await Feedback.find().sort({ form_id: -1 }).limit(1);
    
    let last_form_id = 0;
    if (lastFeedback.length !== 0) {
      last_form_id = lastFeedback[0].form_id;
    }
    form_id = last_form_id + 1;
    console.log("form_id is " + form_id);
      const newForm = await Feedback.create({
          form_id,
          filled,
          title,
          description,
          start_time,
          end_time,
          questions
      });

	  await Employee.updateMany({}, { $push: { feedback_forms: newForm._id } }); // check this line.
	  await Manager.updateMany({}, { $push: { feedback_forms: newForm._id } }); // check this line.
    res.status(201).json(newForm);
  } catch (error) {
      console.error('Error creating form:', error);
      res.status(500).json({ message: 'Failed to create form. Please try again.' });
  }
});


app.get('/fillform', async (req, res) => {
  try {
      const { form_id, employee_id, answers } = req.body;
      const newFilledForm = await DailyTracking.create({
          form_id,
          employee_id,
          answers
      });
      res.status(201).json(newFilledForm);
  } catch (error) {
      console.error('Error filling form:', error);
      res.status(500).json({ message: 'Failed to fill form. Please try again.' });
  }
});

app.get('/displayform', async (req, res) => {
  try {
      const forms = await Feedback.find({});
      res.status(200).json(forms);
  } catch (error) {
      console.error('Error fetching forms:', error);
      res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
  }
});