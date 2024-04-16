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
const { default: axios } = require("axios");
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
	// Ensuring that all of the fields are filled
	if (!username || !email || !password || !role) {
	  return res.status(400).json({ message: 'All fields are required' });
	}
	// Checking if the email is valid
	const validEmail = await verifyEmail(email);
	if (validEmail){
		const hashedPassword = await bcrypt.hash(password, 10);
		// Checking if the email or username already exist in the database.
		const existing = await User.findOne({ $or: [{ username }, { email }] });
		if (existing) {
		return res.status(401).json({ message: 'User already exists' });
		}
		else{
		// Checking if the password is valid and contains at least 8 characters with 1 digit, 1 uppercase letter, 1 lowercase letter, and 1 special character.
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
		if (!password.match(passwordRegex)) {
			// console.log('Password invalid:', password)
			return res.status(400).json({ message: 'Password must contain at least 8 characters with 1 digit, 1 uppercase letter, 1 lowercase letter, and 1 special character.' });
		}
		else {
			const newUser = new User({ username, email, password: hashedPassword, role });
			await newUser.save();
			// Adding the user's credentials to the relevant database
			await addUser(username, email, role);
			res.status(201).json({ message: "Signup successful" });
		}
		}
	}
	else{
		return res.status(400).json({ message: 'Could not verify Email. Please try with a different Email.' });
	}
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Failed to sign up. Please try again.' });
  }
});

const verifyEmail = async (email) => {
	// Checking if the email is valid by using the hunter API

	const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTER_API_KEY}`;

	try{
		const response = await axios.get(url);
		if (response.data.data.status === 'valid'){
			return true;
		}
		else{
			return false;
		}

	} catch(error){
		console.log("Error message:", error.message);
		console.log("Error details:", error.response ? error.response.data : "No response data");

		return false;
	};
}

const addUser = async (username, email, role) => {
	//Adding the details of the user to the rest of the database
}

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

// app.post('/displayform', async (req, res) => {
//     try {
//         const {user} = req.body;
// 		console.log(user)
//         const employee = await Employee.findOne({ employee_id: user }).populate('feedback_forms.form');
//         if (!employee) {
// 			console.log(user)
//             return res.status(404).json({ message: 'Employee not found.' });
//         }

//         const forms = employee.feedback_forms.map(form => ({
//             formId: form.form._id,
//             title: form.form.title,
//             description: form.form.description,
//             start_time: form.form.start_time,
//             end_time: form.form.end_time,
//             filled: form.filled
//         }));
//         res.status(200).json(forms);
//     } catch (error) {
//         console.error('Error fetching forms:', error);
//         res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
//     }
// });

app.get('/displayform', async (req, res) => {
	try {
		const forms = await Feedback.find({});
		res.status(200).json(forms);
	} catch (error) {
		console.error('Error fetching forms:', error);
		res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
	}
  });

// just so i can make employees pls ignore

const getDepartment = async (ddepartment_id) => {
	try {
		const departments = await Department.findOne({department_id: ddepartment_id});
		return departments
	} catch (error) {
		console.error('Error fetching departments:', error);
	}
  }
app.post('/createemployee', async (req, res) => {
	try {
		const {
			employee_name,
			dept,
			gender,
			position,
			salary,
			age,
			address,
			phone_number,
		} = req.body;
		let employee_id = 0;
		const lastEmployee = await Employee.find().sort({ employee_id: -1 }).limit(1);

		let last_employee_id = 0;
		if (lastEmployee.length !== 0)
		{
			last_employee_id = lastEmployee[0].employee_id;
		}
		employee_id = last_employee_id + 1;
		console.log("employee_id is " + employee_id);
		
		const department = await getDepartment(dept);
		// Create the employee
		const newEmployee = new Employee({
			employee_id,
			employee_name,
			department,
			gender,
			position,
			salary,
			age,
			address,
			phone_number
		});

		// Save the employee to the database
		await newEmployee.save();

		res.status(201).json({ message: 'Employee created successfully.', employee: newEmployee });
	} catch (error) {
		console.error('Error creating employee:', error);
		res.status(500).json({ message: 'Failed to create employee. Please try again.' });
	}
  });

app.post('/createdepartment', async (req, res) => {
	  try {
	  const { department_name} = req.body;
	  let department_id = 0;
	  const lastDepartment = await Department.find().sort({ department_id: -1 }).limit(1);
	  
	  let last_department_id = 0;
	  if (lastDepartment.length !== 0) {
		last_department_id = lastDepartment[0].department_id;
	  }
	  department_id = last_department_id + 1;
	  console.log("department_id is " + department_id);
	  const newDepartment = await Department.create({
		  department_id,
		  department_name
	  });
	  res.status(201).json(newDepartment);
  } catch (error) {
	  console.error('Error creating department:', error);
	  res.status(500).json({ message: 'Failed to create department. Please try again.' });
  }
});

