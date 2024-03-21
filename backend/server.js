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
const { all } = require("axios");
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
	try
	{
		// console.log('Fetching user role for:', req.user.username)
		const user = await User.findOne({ username: req.user.username });
		if (!user) return res.status(404).send('User not found');
		// console.log(user)
		res.json({ username: user.username });
	}
	catch (error) {
		console.error('Error fetching user role:', error);
		res.status(500).json({ message: 'Failed to fetch user role' });
	}
});


app.post("/signup", async (req, res) => {
	try
	{
		const { username, email, password, role } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ username, email, password: hashedPassword, role });
		await newUser.save();
		res.status(201).json({ message: "Signup successful" });

	}
	catch (error)
	{
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

function getFirstTwoDigits(number) {

	const numberString = number.toString();
    const firstTwoDigits = numberString.slice(0, 2);

    return firstTwoDigits;
}
app.post('/createform', async (req, res) => {
  	try {

		//get last filled form id and increment it by 1
		const {filled, title, description, start_time, end_time, questions } = req.body;

		let form_id = 0;
		const lastFeedback = await Feedback.find().sort({ form_id: -1 }).limit(1);
		
		let last_form_id = 0;
		if (lastFeedback.length !== 0)
		{
			last_form_id = lastFeedback[0].form_id;
		}
		form_id = last_form_id + 1;
	
		// make a new form
		const newForm = await Feedback.create({
			form_id,
			filled,
			title,
			description,
			start_time,
			end_time,
			questions
		});

		// push the new form to all employees and managers
		await Employee.updateMany({}, { $push: {feedback_forms: { form: newForm, filled: false }} });
		await Manager.updateMany({}, { $push: {feedback_forms: { form: newForm, filled: false }} });

		res.status(201).json(newForm);
	}
	catch (error)
	{
		console.error('Error creating form:', error);
		res.status(500).json({ message: 'Failed to create form. Please try again.' });
	}

});


// app.get('/fillform', async (req, res) => {
//   	try
// 	{
// 		const { form_id, employee_id, answers } = req.body;

// 		const newFilledForm = await DailyTracking.create({
// 			form_id,
// 			employee_id,
// 			answers
// 		});
// 		res.status(201).json(newFilledForm);
// 	}
// 	catch (error) {
// 		console.error('Error filling form:', error);
// 		res.status(500).json({ message: 'Failed to fill form. Please try again.' });
// 	}

// });

app.post('/displayforms', async (req, res) => {
    try
	{
		const {user} = req.body;
		if(getFirstTwoDigits(user) === "10")
		{
			const employee = await Employee.findOne({ employee_id: user }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback',
			});
	
			if (!employee) // if employee doesnt exist
			{
				console.log(user)
				return res.status(404).json({ message: 'Employee not found.' });
			}
	
			const formsWithData = employee.feedback_forms.map(formObj => formObj); // get all forms with data
	
			const forms = formsWithData.map(form => ({ // map the forms to only the required fields
				form_id: form.form.form_id,
				title: form.form.title,
				description: form.form.description,
				start_time: form.form.start_time,
				end_time: form.form.end_time,
				filled: form.filled
			}));
	
			res.status(200).json(forms); // send the forms
		}
		else if(getFirstTwoDigits(user) === "20")
		{
			const manager = await Manager.findOne({ employee_id: user }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback', // Assuming your model name for feedback is 'Feedback'
			});
	
			// console.log("got the employee !", user)
			if (!manager) // if employee doesnt exist
			{
				console.log(user)
				return res.status(404).json({ message: 'Employee not found.' });
			}
			// console.log("FORM ", employee.feedback_forms[0].form);
	
			const formsWithData = manager.feedback_forms.map(formObj => formObj);
	
			// console.log("Feedback Forms with Data: ", formsWithData);
			const forms = formsWithData.map(form => ({
				form_id: form.form.form_id,
				title: form.form.title,
				description: form.form.description,
				start_time: form.form.start_time,
				end_time: form.form.end_time,
				filled: form.filled
			}));
	
			// console.log("forms", forms)
			res.status(200).json(forms);
		}
    }
	catch (error)
	{
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
    }
});

app.post("/fillform", async (req, res) => {
	try
	{
		const { form_id, employee_id, answers } = req.body;
		const employee = await Employee.findOne({ employee_id : employee_id }).populate({
			path: 'feedback_forms.form',
            model: 'Feedback', 
        });
		const formIndex = employee.feedback_forms.findIndex(formObj => formObj.form.form_id === form_id);
		
		const form = employee.feedback_forms[formIndex].form;
		
		console.log("before update ", employee.feedback_forms[formIndex].form);

		employee.feedback_forms[formIndex].ratingList = answers;
		employee.feedback_forms[formIndex].filled = true;

		console.log("new employee should hav form ", employee.feedback_forms[formIndex]);
		await employee.save();

		const updatedEmployee = await Employee.findOne({ employee_id }).populate({
			path: 'feedback_forms.form',
			model: 'Feedback',
		});
		
		// console.log("Updated employee:", updatedEmployee.feedback_forms[1].form.questions[0]);
		res.status(201).json("Form filled successfully");
	}
	catch (error) {
		console.error('Error filling form:', error);
		res.status(500).json({ message: 'Failed to fill form. Please try again.' });
	}
});

app.post("/displayresults", async (req, res) => {
	try
	{
		const { form_id } = req.body;
		console.log("form_id ", form_id)
		const form = await Feedback.findOne({ form_id: form_id });
		const allEmployees = await Employee.find({}).populate({
			path: 'feedback_forms.form',
            model: 'Feedback', // Assuming your model name for feedback is 'Feedback'
        });
		const allManagers = await Manager.find({}).populate({
			path: 'feedback_forms.form',
			model: 'Feedback', // Assuming your model name for feedback is 'Feedback'
		});
		// console.log("Form ", form)
		let total_ratings = [];
		for(let j = 0; j < form.questions.length; j++)
		{
			total_ratings.push({question: "", total_rating: 0, rating1: 0, rating2: 0, rating3: 0, rating4: 0, rating5: 0});
		}
		// console.log(allEmployees.length, allManagers.length);
		for(let i = 0; i < allEmployees.length; i++)
		{
			const employee = allEmployees[i];
			// console.log("employee ", employee.feedback_forms)
			const formIndex = employee.feedback_forms.findIndex(formObj => formObj.form.form_id == form_id);
			// console.log("formIndex ", formIndex)
			if(formIndex === -1)
			{
				continue;
			}
			else
			{
				const forms = employee.feedback_forms[formIndex].form;
				const form_ratings = employee.feedback_forms[formIndex].ratingList;
				// console.log("Form rating ", form_ratings);
				for(let j = 0; j < forms.questions.length; j++)
				{
					const question = forms.questions[j];
				
					total_ratings[j].question = question.question;
					// console.log("questions ", total_ratings[j].question)
					if(form_ratings[j] === 1)
					{
						total_ratings[j].rating1 += 1;
					}
					else if(form_ratings[j] === 2)
					{
						total_ratings[j].rating2 += 1;
					}
					else if(form_ratings[j] === 3)
					{
						total_ratings[j].rating3 += 1;
					}
					else if(form_ratings[j] === 4)
					{
						total_ratings[j].rating4 += 1;
					}
					else if(form_ratings[j] === 5)
					{
						total_ratings[j].rating5 += 1;
					}
					// console.log("total_ratings[j].total_rating ", total_ratings[j].total_rating, form_ratings[j], i)
					total_ratings[j].total_rating += form_ratings[j];
					// console.log("total_ratings[j].total_rating ", total_ratings[j].total_rating)

				}
			}
		}

		for(let i = 0; i < allManagers.length; i++)
		{
			const managers = allManagers[i];
			const formIndex = managers.feedback_forms.findIndex(formObj => formObj.form.form_id === form_id);

			if(formIndex === -1)
			{
				continue;
			}
			else 
			{
				const forms = managers.feedback_forms[formIndex].form;
				const form_ratings = managers.feedback_forms[formIndex].ratingList;
				for(let j = 0; j < forms.questions.length; j++)
				{
					const question = forms.questions[j];
				
					total_ratings[j].question = question.question;
					if(form_ratings[j] === 1)
					{
						total_ratings[j].rating1 += 1;
					}
					else if(form_ratings[j] === 2)
					{
						total_ratings[j].rating2 += 1;
					}
					else if(form_ratings[j] === 3)
					{
						total_ratings[j].rating3 += 1;
					}
					else if(form_ratings[j] === 4)
					{
						total_ratings[j].rating4 += 1;
					}
					else if(form_ratings[j] === 5)
					{
						total_ratings[j].rating5 += 1;
					}
					total_ratings[j].total_rating += form_ratings[j];
				}
			}
		}
		res.send(total_ratings);
	}
	catch (error)
	{
		console.error('Error fetching forms:', error);
		res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
	}
});

// not needed anymore
// app.get('/displayform', async (req, res) => {
// 	try {
// 		const forms = await Feedback.find({});
// 		res.status(200).json(forms);
// 	} catch (error) {
// 		console.error('Error fetching forms:', error);
// 		res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
// 	}
//   });

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

