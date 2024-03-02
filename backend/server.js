const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
// import user from "./models/users.model";
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
// const uri = "mongodb://localhost:27017/HR-Analytics-and-Reporting";
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
      res.status(569).json("Error")
    }
  }
  catch(error)
  {
    console.error('Login error:', error.response ? error.response.data : error.message);
  }
});

app.listen(8000, () => 
{
  console.log("Server started on port 8000");
});

app.post('/createform', async (req, res) => {
  try {
      const { form_id, filled, title, description, start_time, end_time, questions } = req.body;
      // need to fetch newest feedback form id and increment by 1
      // Create the form
      const newForm = await Feedback.create({
          form_id,
          filled,
          title,
          description,
          start_time,
          end_time,
          questions
      });
      // after form is created, its uploaded to all employee and manager databases also
	  // so that they can fill it out
	  await Employee.updateMany({}, { $push: { feedback_forms: newForm._id } });
      res.status(201).json(newForm);
  } catch (error) {
      console.error('Error creating form:', error);
      res.status(500).json({ message: 'Failed to create form. Please try again.' });
  }
});